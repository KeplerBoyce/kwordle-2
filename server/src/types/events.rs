use serde::{Deserialize, Serialize};

use crate::words::gen_answer;

use super::data::Player;


pub enum Event {
    ChangePlayersEvent(ChangePlayersEvent),
    StartGameEvent(StartGameEvent),
    NewWordEvent(NewWordEvent),
    GameFullEvent(GameFullEvent),
    TypingEvent(TypingEvent),
}

impl Event {
    pub fn to_string(&self) -> String {
        match self {
            Event::ChangePlayersEvent(e) => serde_json::to_string(e).unwrap(),
            Event::StartGameEvent(e) => serde_json::to_string(e).unwrap(),
            Event::NewWordEvent(e) => serde_json::to_string(e).unwrap(),
            Event::GameFullEvent(e) => serde_json::to_string(e).unwrap(),
            Event::TypingEvent(e) => serde_json::to_string(e).unwrap(),
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventType {
    ChangePlayers,
    StartGame,
    NewWord,
    GameFull,
    Typing,
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

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameFullEvent {
    pub typ: EventType,
    pub players: Vec<Player>,
    pub word: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TypingEvent {
    pub typ: EventType,
    pub user_id: String,
    pub typing: [bool; 5],
}

impl TypingEvent {
    pub fn create(user_id: String, typing: [bool; 5]) -> Self {
        Self {
            typ: EventType::Typing,
            user_id,
            typing,
        }
    }
}
