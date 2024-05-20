use parking_lot::Mutex;
use actix_web::web::{Data, Path};
use actix_web::{get, HttpResponse};

use crate::db::Database;
use crate::types::common::ServerErr;
use crate::types::reqres::IsHostRes;


#[get("/api/game/{game_id}/host/{user_id}")]
pub async fn get(
    path: Path<(String, String)>,
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let (game_id, user_id): (String, String) = path.into_inner();

    let is_host = if let Some(host_id) = db.lock().get_game_host_id(game_id) {
        host_id == user_id
    } else {
        false
    };

    Ok(HttpResponse::Ok().json(IsHostRes::create(is_host)))
}
