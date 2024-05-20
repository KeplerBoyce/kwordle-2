use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub struct Game {
    pub started: bool,
    pub host_id: String,
    pub players: HashMap<String, Player>
}

impl Game {
    pub fn new(host_id: String) -> Self {
        Self {
            started: false,
            host_id,
            players: HashMap::new(),
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
}

impl Player {
    pub fn create(user_id: String, username: String) -> Self {
        Self {
            user_id,
            username,
            guesses: Vec::new(),
            score: 0,
            ready: false,
        }
    }
}
