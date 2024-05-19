use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetUsernameReq {
    pub user_id: String,
    pub username: String,
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


