use parking_lot::Mutex;
use actix_web::web::Data;
use actix_web::{HttpResponse, post};

use crate::db::Database;
use crate::types::common::ServerErr;
use crate::types::reqres::NewGameRes;


#[post("/api/game/new")]
pub async fn post(
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id = db.lock().create_game();

    Ok(HttpResponse::Ok().json(NewGameRes::create(game_id)))
}
