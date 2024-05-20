use serde::{Deserialize, Serialize};

use crate::words::gen_answer;

use super::data::Player;


pub enum Event {
    ChangePlayersEvent(ChangePlayersEvent),
    StartGameEvent(StartGameEvent),
    NewWordEvent(NewWordEvent),
}

impl Event {
    pub fn to_string(&self) -> String {
        match self {
            Event::ChangePlayersEvent(e) => serde_json::to_string(e).unwrap(),
            Event::StartGameEvent(e) => serde_json::to_string(e).unwrap(),
            Event::NewWordEvent(e) => serde_json::to_string(e).unwrap(),
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventType {
    ChangePlayers,
    StartGame,
    NewWord,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChangePlayersEvent {
    pub typ: EventType,
    pub players: Vec<Player>,
}

impl ChangePlayersEvent {
    pub fn create(players: Vec<Player>) -> Self {
        Self {
            typ: EventType::ChangePlayers,
            players,
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartGameEvent {
    pub typ: EventType,
}

impl StartGameEvent {
    pub fn create() -> Self {
        Self {
            typ: EventType::StartGame,
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewWordEvent {
    pub typ: EventType,
    pub word: String,
}

impl NewWordEvent {
    pub fn create() -> Self {
        Self {
            typ: EventType::NewWord,
            word: gen_answer(),
        }
    }
}
