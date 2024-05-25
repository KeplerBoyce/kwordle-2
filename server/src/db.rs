use std::collections::{hash_map::Entry, HashMap};
use actix_web::web::Data;
use parking_lot::Mutex;
use nanoid::nanoid;

use crate::{hourglass::Hourglass, types::{data::{Game, GameState, Player}, events::GameFullEvent}};


pub struct Database {
    players: HashMap<String, String>, // Map user_id to game_id
    games: HashMap<String, Game>, // Map game_id to Game struct
}

impl Database {
    pub fn new() -> Self {
        Database {
            players: HashMap::new(),
            games: HashMap::new(),
        }
    }

    pub fn create() -> Data<Mutex<Self>> {
        Data::new(Mutex::new(Database::new()))
    }

    pub fn add_player(&mut self, user_id: String, game_id: String) {
        self.players.insert(user_id, game_id);
    }

    pub fn get_player_game_id(&self, user_id: String) -> Option<String> {
        if let Some(game_id) = self.players.get(&user_id) {
            Some(game_id.clone())
        } else {
            None
        }
    }

    pub fn get_game_full_event(
        &self,
        game_id: String,
        hourglass: Data<Mutex<Hourglass>>,
    ) -> Option<GameFullEvent> {
        if let Some(game) = self.games.get(&game_id) {
            let ms_left = if let Some(sand) = hourglass.lock().get_sand_left(game_id) {
                sand
            } else {
                0
            };
            Some(game.to_game_full_event(ms_left))
        } else {
            None
        }
    }

    pub fn get_player_mut(&mut self, user_id: String) -> Option<&mut Player> {
        if let Some(game_id) = self.players.get(&user_id) {
            if let Some(game) = self.games.get_mut(game_id) {
                if let Some(player) = game.players.get_mut(&user_id) {
                    return Some(player);
                }
            }
        }
        None
    }

    pub fn create_game(&mut self, host_id: String) -> String {
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
        self.games.insert(id.clone(), Game::new(host_id));
        id
    }

    pub fn get_game(&self, game_id: String) -> Option<Game> {
        if let Some(game) = self.games.get(&game_id) {
            Some(game.clone())
        } else {
            None
        }
    }

    pub fn get_game_mut(&mut self, game_id: String) -> Option<&mut Game> {
        if let Some(game) = self.games.get_mut(&game_id) {
            Some(game)
        } else {
            None
        }
    }

    pub fn set_game_state(&mut self, game_id: String, state: GameState) {
        if let Some(game) = self.games.get_mut(&game_id) {
            game.state = state;
        }
    }

    pub fn clear_game_player_guesses(&mut self, game_id: String) {
        if let Some(game) = self.games.get_mut(&game_id) {
            for (_, player) in &mut game.players {
                player.guesses = Vec::new();
            }
        }
    }

    pub fn add_or_update_username(
        &mut self,
        game_id: String,
        user_id: String,
        username: String,
    ) {
        if let Some(game) = self.games.get_mut(&game_id) {
            match game.players.entry(user_id.clone()) {
                Entry::Occupied(mut x) => {
                    x.get_mut().username = username;
                },
                Entry::Vacant(x) => {
                    x.insert(Player::create(user_id, username));
                },
            }
        }
    }

    pub fn get_game_user_ids(&self, game_id: String) -> Vec<String> {
        let mut user_ids = Vec::new();
        if let Some(game) = self.games.get(&game_id) {
            for (user_id, _) in &game.players {
                user_ids.push(user_id.clone());
            }
        }
        user_ids
    }

    pub fn get_game_players(&self, game_id: String) -> Vec<Player> {
        if let Some(game) = self.games.get(&game_id) {
            game.players.iter().map(|(_, p)| p.clone()).collect()
        } else {
            Vec::new()
        }
    }
}
