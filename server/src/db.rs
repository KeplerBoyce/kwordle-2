use std::collections::{hash_map::Entry, HashMap};
use actix_web::web::Data;
use parking_lot::Mutex;
use nanoid::nanoid;

use crate::types::data::{Game, Player};


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

    pub fn create_game(&mut self) -> String {
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
        self.games.insert(id.clone(), Game::new());
        id
    }

    pub fn add_or_update_username(
        &mut self,
        game_id: String,
        user_id: String,
        username: String,
    ) -> Vec<String> {
        if let Some(game) = self.games.get_mut(&game_id) {
            match game.players.entry(user_id) {
                Entry::Occupied(mut x) => {
                    x.get_mut().username = username;
                },
                Entry::Vacant(x) => {
                    x.insert(Player::create(username));
                },
            }
        }
        self.get_game_usernames(game_id)
    }

    pub fn get_game_usernames(&self, game_id: String) -> Vec<String> {
        let mut usernames = Vec::new();
        if let Some(game) = self.games.get(&game_id) {
            for (_, player) in &game.players {
                usernames.push(player.username.clone());
            }
        }
        usernames
    }
}
