use actix_web::web::{Bytes, Data};
use futures::Stream;
use log::debug;
use parking_lot::Mutex;
use std::cell::RefCell;
use std::pin::Pin;
use std::rc::Rc;
use std::time::Duration;
use std::task::{Context, Poll};
use std::collections::{HashMap, HashSet};
use tokio::sync::mpsc::{channel, Receiver, Sender};
use tokio::time::{interval_at, Instant};

use crate::db::Database;
use crate::hourglass::Hourglass;
use crate::types::common::ServerErr;
use crate::types::events::{ChangePlayersEvent, Event};


pub struct Client(Receiver<Bytes>);

impl Stream for Client {
    type Item = Result<Bytes, ServerErr>;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        match Pin::new(&mut self.0).poll_recv(cx) {
            Poll::Ready(Some(v)) => Poll::Ready(Some(Ok(v))),
            Poll::Ready(None) => Poll::Ready(None),
            Poll::Pending => Poll::Pending,
        }
    }
}

pub struct Broadcaster {
    clients: HashMap<String, Sender<Bytes>>,
}

impl Broadcaster {
    pub fn create(
        db: Data<Mutex<Database>>,
        hg_rc: Rc<RefCell<Option<Data<Mutex<Hourglass>>>>>,
    ) -> Data<Mutex<Self>> {
        let broadcaster = Data::new(Mutex::new(Broadcaster::new()));

        Broadcaster::spawn_ping(broadcaster.clone(), db.clone(), hg_rc);
        broadcaster
    }

    fn new() -> Self {
        Broadcaster {
            clients: HashMap::new(),
        }
    }

    // Heartbeat on 10 second interval
    fn spawn_ping(
        me: Data<Mutex<Self>>,
        db: Data<Mutex<Database>>,
        hg_rc: Rc<RefCell<Option<Data<Mutex<Hourglass>>>>>,
    ) {
        actix_web::rt::spawn(async move {
            let mut interval = interval_at(Instant::now(), Duration::from_secs(2));
            loop {
                interval.tick().await;
                me.lock().remove_stale_clients(db.clone(), hg_rc.clone());
            }
        });
    }

    fn remove_stale_clients(
        &mut self,
        db: Data<Mutex<Database>>,
        hg_rc: Rc<RefCell<Option<Data<Mutex<Hourglass>>>>>,
    ) {
        let mut to_remove: Vec<String> = Vec::new();
        let mut games_to_update: HashSet<String> = HashSet::new();

        for (id, x) in &self.clients {
            let res = x.clone().try_send(Bytes::from(
                "event: internal_status\ndata: ping\n\n")).is_ok();
            if !res {
                to_remove.push(id.clone());
                debug!("removing stale client: {}", id.clone());

                let game_id_option = db.lock().get_player_game_id(id.clone());
                if let Some(game_id) = game_id_option {
                    games_to_update.insert(game_id);
                }
                db.lock().leave_player(id.clone());
            }
        }
        self.clients.retain(|id, _| !to_remove.contains(id));

        for game_id in games_to_update {
            let num_players = db.lock().get_game(game_id.clone()).unwrap().players.len();
            if num_players == 0 {
                debug!("clearing game {}; all players are disconnected", game_id);

                db.lock().clear_game(game_id.clone());
                continue;
            }

            let players = db.lock().get_game_players(game_id.clone());
            let state = db.lock().get_game(game_id.clone()).unwrap().state;
            let player_event = Event::ChangePlayersEvent(ChangePlayersEvent::create(players.clone(), state));
            let event = Bytes::from(["data: ", &player_event.to_string(), "\n\n"].concat());

            debug!("sending player event to game {} to remove disconnected players", game_id);
            for user_id in db.lock().get_game_user_ids(game_id.clone()) {
                if let Some(x) = self.clients.get(&user_id) {
                    x.try_send(event.clone()).unwrap_or(());
                }
            }

            let word = db.lock().get_game(game_id.clone()).unwrap().word;
            let mut num_done = 0;
            for player in &players {
                if let Some(last) = player.guesses.last() {
                    if *last == word || player.guesses.len() == 6 {
                        num_done += 1;
                    }
                }
            }
            if num_done == players.len() {
                if let Some(hg) = hg_rc.borrow_mut().as_deref() {
                    hg.lock().set_glass(game_id.clone(), 0);
                }
            }
        }
        if to_remove.len() > 0 {
            debug!("removed stale clients, now {} in total", self.clients.len());
        }
    }

    pub fn new_user_client(&mut self, user_id: String) -> (Client, Sender<Bytes>) {
        let (tx, rx) = channel(100);
        
        self.clients.insert(user_id, tx.clone());
        (Client(rx), tx)
    }

    pub fn send_single(&self, user_id: String, event: Event) {
        if let Some(client) = self.clients.get(&user_id) {
            let event = Bytes::from(["data: ", &event.to_string(), "\n\n"].concat());
    
            client.try_send(event.clone()).unwrap_or(());
        }
    }

    pub fn send_game(&self, db: Data<Mutex<Database>>, game_id: String, event: Event) {
        let event = Bytes::from(["data: ", &event.to_string(), "\n\n"].concat());

        for user_id in db.lock().get_game_user_ids(game_id) {
            if let Some(x) = self.clients.get(&user_id) {
                x.try_send(event.clone()).unwrap_or(());
            }
        }
    }
}
