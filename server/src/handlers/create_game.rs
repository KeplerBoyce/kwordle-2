use parking_lot::Mutex;
use actix_web::web::Data;
use actix_web::{HttpResponse, get};

use crate::db::Database;
use crate::types::ServerErr;


#[get("/api/game/new")]
pub async fn get(
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id = db.lock().create_game();

    Ok(HttpResponse::Ok().json(game_id))
}
