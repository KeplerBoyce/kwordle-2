use serde::{Deserialize, Serialize};

use super::data::{GameState, Player};


#[derive(Clone)]
pub enum Event {
    ChangePlayersEvent(ChangePlayersEvent),
    StartGameEvent(StartGameEvent),
    NewWordEvent(NewWordEvent),
    GameFullEvent(GameFullEvent),
    TypingEvent(TypingEvent),
    RoundStartEvent(RoundStartEvent),
    RoundEndEvent(RoundEndEvent),
    GameEndEvent(GameEndEvent),
}

impl Event {
    pub fn to_string(&self) -> String {
        match self {
            Event::ChangePlayersEvent(e) => serde_json::to_string(e).unwrap(),
            Event::StartGameEvent(e) => serde_json::to_string(e).unwrap(),
            Event::NewWordEvent(e) => serde_json::to_string(e).unwrap(),
            Event::GameFullEvent(e) => serde_json::to_string(e).unwrap(),
            Event::TypingEvent(e) => serde_json::to_string(e).unwrap(),
            Event::RoundStartEvent(e) => serde_json::to_string(e).unwrap(),
            Event::RoundEndEvent(e) => serde_json::to_string(e).unwrap(),
            Event::GameEndEvent(e) => serde_json::to_string(e).unwrap(),
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventType {
    ChangePlayers,
    StartGame,
    NewWord,
    GameFull,
    Typing,
    RoundStart,
    RoundEnd,
    GameEnd,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChangePlayersEvent {
    pub typ: EventType,
    pub players: Vec<Player>,
    pub state: GameState,
}

impl ChangePlayersEvent {
    pub fn create(players: Vec<Player>, state: GameState) -> Self {
        Self {
            typ: EventType::ChangePlayers,
            players,
            state,
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
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

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewWordEvent {
    pub typ: EventType,
    pub word: String,
}

impl NewWordEvent {
    pub fn create(word: String,) -> Self {
        Self {
            typ: EventType::NewWord,
            word,
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameFullEvent {
    pub typ: EventType,
    pub state: GameState,
    pub round_time: i32,
    pub pre_round_time: i32,
    pub ms_left: i32,
    pub players: Vec<Player>,
    pub word: String,
    pub num_rounds: i32,
    pub round: i32,
}

#[derive(Clone, Deserialize, Serialize)]
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

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoundStartEvent {
    pub typ: EventType,
}

impl RoundStartEvent {
    pub fn create() -> Self {
        Self {
            typ: EventType::RoundStart
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoundEndEvent {
    pub typ: EventType,
}

impl RoundEndEvent {
    pub fn create() -> Self {
        Self {
            typ: EventType::RoundEnd
        }
    }
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameEndEvent {
    pub typ: EventType,
}

impl GameEndEvent {
    pub fn create() -> Self {
        Self {
            typ: EventType::GameEnd
        }
    }
}
