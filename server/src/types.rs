use std::{error::Error, fmt::{self, Display}};
use actix_web::{http::{header::ContentType, StatusCode}, HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};


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

#[derive(Debug)]
pub enum ServerErr {
    Internal(String),
    BadReq(String),
    Forbidden(String),
    NotFound(String),
}

impl Display for ServerErr {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", match self {
            ServerErr::Internal(x) => x,
            ServerErr::BadReq(x) => x,
            ServerErr::Forbidden(x) => x,
            ServerErr::NotFound(x) => x,
        })
    }
}

impl Error for ServerErr {}

impl ResponseError for ServerErr {
    fn status_code(&self) -> StatusCode {
        match *self {
            ServerErr::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ServerErr::BadReq(_) => StatusCode::BAD_REQUEST,
            ServerErr::Forbidden(_) => StatusCode::FORBIDDEN,
            ServerErr::NotFound(_) => StatusCode::NOT_FOUND,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::html())
            .body(self.to_string())
    }
}

