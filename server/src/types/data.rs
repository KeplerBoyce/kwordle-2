use std::collections::HashMap;

pub struct Game {
    pub players: HashMap<String, Player>
}

impl Game {
    pub fn new() -> Self {
        Game {
            players: HashMap::new(),
        }
    }
}

pub struct Player {
    pub username: String,
    pub guesses: Vec<String>,
    pub score: i32,
}

impl Player {
    pub fn create(username: String) -> Self {
        Player {
            username,
            guesses: Vec::new(),
            score: 0,
        }
    }
}
