use serde::{Deserialize, Serialize};


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