use parking_lot::Mutex;
use actix_web::web::{Data, Json};
use actix_web::{HttpResponse, post};

use crate::db::Database;
use crate::types::common::ServerErr;
use crate::types::reqres::{CreateGameReq, NewGameRes};


#[post("/api/game/new")]
pub async fn post(
    data: Json<CreateGameReq>,
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let req_data = data.into_inner();
    let game_id = db.lock().create_game(req_data.host_id.clone());

    Ok(HttpResponse::Ok().json(NewGameRes::create(game_id)))
}
