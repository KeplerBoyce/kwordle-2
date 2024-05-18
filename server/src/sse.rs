use actix_web::web::{Bytes, Data};
use futures::Stream;
use parking_lot::Mutex;
use std::pin::Pin;
use std::time::Duration;
use std::task::{Context, Poll};
use std::collections::HashMap;
use tokio::sync::mpsc::{channel, Receiver, Sender};
use tokio::time::{interval_at, Instant};

use crate::types::{Event, ServerErr};


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
    clients: HashMap<String, Vec<Sender<Bytes>>>,
}

impl Broadcaster {
    pub fn create() -> Data<Mutex<Self>> {
        let broadcaster = Data::new(Mutex::new(Broadcaster::new()));

        Broadcaster::spawn_ping(broadcaster.clone());
        broadcaster
    }

    fn new() -> Self {
        Broadcaster {
            clients: HashMap::new(),
        }
    }

    // Heartbeat on 10 second interval
    fn spawn_ping(me: Data<Mutex<Self>>) {
        actix_web::rt::spawn(async move {
            let mut interval = interval_at(Instant::now(), Duration::from_secs(10));
            loop {
                interval.tick().await;
                me.lock().remove_stale_clients();
            }
        });
    }

    fn remove_stale_clients(&mut self) {
        for vec in self.clients.values_mut() {
            vec.retain(|x| x.clone().try_send(Bytes::from("event: internal_status\ndata: ping\n\n")).is_ok());
        }
        self.clients.retain(|_, v| v.len() != 0);
    }

    pub fn new_user_client(&mut self, username: String) -> (Client, Sender<Bytes>) {
        let (tx, rx) = channel(100);

        self.clients.entry(username)
            .and_modify(|v| v.push(tx.clone()))
            .or_insert(vec![tx.clone()]);
        (Client(rx), tx)
    }

    pub fn send_single(&self, client: &Sender<Bytes>, event: Event) {
        let event = Bytes::from(["data: ", &event.to_string(), "\n\n"].concat());

        client.try_send(event.clone()).unwrap_or(());
    }
}