use serde::{Deserialize, Serialize};

use super::data::Player;


pub enum Event {
    GuessEvent(GuessEvent),
    ChangePlayersEvent(ChangePlayersEvent),
    StartGameEvent(StartGameEvent),
}

impl Event {
    pub fn to_string(&self) -> String {
        match self {
            Event::GuessEvent(e) => serde_json::to_string(e).unwrap(),
            Event::ChangePlayersEvent(e) => serde_json::to_string(e).unwrap(),
            Event::StartGameEvent(e) => serde_json::to_string(e).unwrap(),
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventType {
    Guess,
    ChangePlayers,
    StartGame,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GuessEvent {
    pub typ: EventType,
    pub username: String,
    pub guess: String,
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
