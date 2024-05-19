use serde::{Deserialize, Serialize};


pub enum Event {
    GuessEvent(GuessEvent),
}

impl Event {
    pub fn to_string(&self) -> String {
        match self {
            Event::GuessEvent(e) => serde_json::to_string(e).unwrap(),
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GuessEvent {
    pub username: String,
    pub guess: String,
}
