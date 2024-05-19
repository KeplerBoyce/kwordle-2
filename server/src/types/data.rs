pub struct Game {
    pub players: Vec<Player>
}

impl Game {
    pub fn new() -> Self {
        Game {
            players: Vec::new(),
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
