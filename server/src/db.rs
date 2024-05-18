use std::collections::HashMap;
use actix_web::web::Data;
use parking_lot::Mutex;
use nanoid::nanoid;

use crate::types::{Game, Player};


pub struct Database {
    games: HashMap<String, Game>,
}

impl Database {
    pub fn new() -> Self {
        Database {
            games: HashMap::new(),
        }
    }

    pub fn create() -> Data<Mutex<Self>> {
        Data::new(Mutex::new(Database::new()))
    }

    pub fn create_game(&mut self) {
        let alphabet: [char; 36] = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        ];    
        let mut id: String;
        loop {
            id = nanoid!{6, &alphabet};
            if !self.games.contains_key(&id) {
                break;
            }
        }
        println!("created game with id {}", id.clone());
        self.games.insert(id, Game::new());
    }

    pub fn add_player_to_game(&mut self, game_id: String, username: String) {
        println!("added player {} to game with id {}", username, game_id);
        if let Some(x) = self.games.get_mut(&game_id) {
            x.players.push(Player::create(username));
        }
    }
}
