use serde::{Deserialize, Serialize};


#[derive(Clone, Copy, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OkResponse {
    pub ok: bool,
}

pub static OK_RES: OkResponse = OkResponse {
    ok: true,
};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetUsernameReq {
    pub user_id: String,
    pub username: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateGameReq {
    pub host_id: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartGameReq {
    pub host_id: String,
    pub rounds: i32,
    pub round_time: i32,
    pub pre_round_time: i32,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GuessReq {
    pub guess: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TypingReq {
    pub typing: [bool; 5],
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewGameRes {
    pub id: String,
}

impl NewGameRes {
    pub fn create(id: String) -> Self {
        NewGameRes {
            id,
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameUsernamesRes {
    pub usernames: Vec<String>,
}

impl GameUsernamesRes {
    pub fn create(usernames: Vec<String>) -> Self {
        GameUsernamesRes {
            usernames,
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HostRes {
    pub host: String,
}

impl HostRes {
    pub fn create(host: String) -> Self {
        HostRes {
            host,
        }
    }
}
