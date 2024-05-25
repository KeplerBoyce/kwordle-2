use std::collections::HashMap;
use serde::{Deserialize, Serialize};

use crate::words::gen_answer;
use super::events::{EventType, GameFullEvent};


#[derive(Clone)]
pub struct Game {
    pub state: GameState,
    pub host_id: String,
    pub players: HashMap<String, Player>,
    pub word: String,
    pub round_time: i32,
    pub pre_round_time: i32,
    pub num_rounds: i32,
    pub round: i32,
    pub num_solved: i32,
}

impl Game {
    pub fn new(host_id: String) -> Self {
        Self {
            state: GameState::PreStart,
            host_id,
            players: HashMap::new(),
            word: gen_answer(),
            round_time: 60000,
            pre_round_time: 5000,
            num_rounds: 3,
            round: 0,
            num_solved: 0,
        }
    }

    pub fn to_game_full_event(&self, ms_left: i32) -> GameFullEvent {
        GameFullEvent {
            typ: EventType::GameFull,
            state: self.state.clone(),
            round_time: self.round_time,
            pre_round_time: self.pre_round_time,
            ms_left,
            players: self.players.iter().map(|(_, p)| p.clone()).collect(),
            word: self.word.clone(),
            num_rounds: self.num_rounds,
            round: self.round,
        }
    }
}


#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum GameState {
    PreStart,
    PreRound,
    Round,
    Ended,
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
