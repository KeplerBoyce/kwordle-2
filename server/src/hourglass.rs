use std::collections::HashMap;
use std::time::{Duration, SystemTime};
use actix_web::web::Data;
use parking_lot::Mutex;
use tokio::time::{interval_at, Instant};

use crate::sse::Broadcaster;
use crate::types::events::{ChangePlayersEvent, Event, GameEndEvent, NewWordEvent, RoundEndEvent, RoundStartEvent};
use crate::words::gen_answer;
use crate::{db::Database, types::data::GameState};


pub struct Hourglass {
    glasses: HashMap<String, Glass>,
}

pub struct Glass {
    sand: i32,
    sys_time: SystemTime,
}

impl Glass {
    pub fn new(sand: i32) -> Self {
        Self {
            sand,
            sys_time: SystemTime::now(),
        }
    }

    pub fn set_now(&mut self, sand: i32) {
        self.sand = sand;
        self.sys_time = SystemTime::now();
    }
}

impl Hourglass {
    pub fn create(db: Data<Mutex<Database>>, broadcaster: Data<Mutex<Broadcaster>>) -> Data<Mutex<Self>> {
        let hourglass = Data::new(Mutex::new(Hourglass::new()));
        
        Hourglass::tick_glasses(db.clone(), broadcaster.clone(), hourglass.clone());
        hourglass
    }

    fn new() -> Self {
        Hourglass {
            glasses: HashMap::new(),
        }
    }

    fn tick_glasses(
        db: Data<Mutex<Database>>,
        broadcaster: Data<Mutex<Broadcaster>>,
        hourglass: Data<Mutex<Self>>,
    ) {
        actix_web::rt::spawn(async move {
            let mut interval = interval_at(Instant::now(), Duration::from_millis(100));
            loop {
                interval.tick().await;
                hourglass.lock().break_empty_glasses(db.clone(), broadcaster.clone()).await;
            }
        });
    }

    async fn break_empty_glasses(
        &mut self,
        db: Data<Mutex<Database>>,
        broadcaster: Data<Mutex<Broadcaster>>,
    ) {
        let mut glasses_to_break: Vec<String> = Vec::new();

        for (game_id, glass) in &mut self.glasses {
            if glass.sys_time.elapsed().unwrap().as_millis() as i32 > glass.sand {
                let game_option = db.lock().get_game(game_id.clone());
                if let Some(game) = game_option {
                    match game.state {
                        GameState::PreStart => {},
                        GameState::PreRound => {
                            glass.set_now(game.round_time);
                            db.lock().set_game_state(game_id.clone(), GameState::Round);
                            db.lock().clear_game_player_guesses(game_id.clone());

                            let new_word = gen_answer();
                            db.lock().get_game_mut(game_id.clone()).unwrap().word = new_word.clone();
                            db.lock().get_game_mut(game_id.clone()).unwrap().round += 1;
                            db.lock().get_game_mut(game_id.clone()).unwrap().num_solved = 0;
                            let word_event = NewWordEvent::create(new_word);
                            broadcaster.lock().send_game(db.clone(), game_id.clone(), Event::NewWordEvent(word_event));

                            let players = db.lock().get_game_players(game_id.clone());
                            let player_event = ChangePlayersEvent::create(players);
                            broadcaster.lock().send_game(db.clone(), game_id.clone(), Event::ChangePlayersEvent(player_event));

                            let start_event = RoundStartEvent::create();
                            broadcaster.lock().send_game(db.clone(), game_id.clone(), Event::RoundStartEvent(start_event));
                        },
                        GameState::Round => {
                            if game.round == game.num_rounds {
                                glasses_to_break.push(game_id.clone());
                                db.lock().set_game_state(game_id.clone(), GameState::Ended);

                                let event = GameEndEvent::create();
                                broadcaster.lock().send_game(db.clone(), game_id.clone(), Event::GameEndEvent(event));
                            } else {
                                glass.set_now(game.pre_round_time);
                                db.lock().set_game_state(game_id.clone(), GameState::PreRound);

                                let event = RoundEndEvent::create();
                                broadcaster.lock().send_game(db.clone(), game_id.clone(), Event::RoundEndEvent(event));
                            }
                        },
                        GameState::Ended => {},
                    }
                }
            }
        }
        for id in glasses_to_break {
            self.glasses.remove(&id);
        }
    }

    pub fn get_sand_left(&self, game_id: String) -> Option<i32> {
        if let Some(game) = self.glasses.get(&game_id) {
            let elapsed = game.sys_time.elapsed().unwrap().as_millis();
            Some(if elapsed as i32 > game.sand {
                0
            } else {
                game.sand - elapsed as i32
            })
        } else {
            None
        }
    }

    pub fn set_glass(&mut self, game_id: String, sand: i32) {
        self.glasses.insert(game_id, Glass::new(sand));
    }
}
