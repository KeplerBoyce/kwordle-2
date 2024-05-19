use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub struct Game {
    pub players: HashMap<String, Player>
}

impl Game {
    pub fn new() -> Self {
        Self {
            players: HashMap::new(),
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub username: String,
    pub guesses: Vec<String>,
    pub score: i32,
}

impl Player {
    pub fn create(username: String) -> Self {
        Self {
            username,
            guesses: Vec::new(),
            score: 0,
        }
    }
}
