use std::collections::HashMap;
use serde::{Deserialize, Serialize};

use crate::words::gen_answer;
use super::events::{EventType, GameFullEvent};


pub struct Game {
    pub started: bool,
    pub host_id: String,
    pub players: HashMap<String, Player>,
    pub word: String,
}

impl Game {
    pub fn new(host_id: String) -> Self {
        Self {
            started: false,
            host_id,
            players: HashMap::new(),
            word: gen_answer(),
        }
    }

    pub fn to_game_full_event(&self) -> GameFullEvent {
        GameFullEvent {
            typ: EventType::GameFull,
            players: self.players.iter().map(|(_, p)| p.clone()).collect(),
            word: self.word.clone(),
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub user_id: String,
    pub username: String,
    pub guesses: Vec<String>,
    pub score: i32,
    pub ready: bool,
    pub typing: [bool; 5],
}

impl Player {
    pub fn create(user_id: String, username: String) -> Self {
        Self {
            user_id,
            username,
            guesses: Vec::new(),
            score: 0,
            ready: false,
            typing: [false; 5],
        }
    }
}
