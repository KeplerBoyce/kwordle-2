use parking_lot::Mutex;
use actix_web::web::{Data, Path};
use actix_web::{get, HttpResponse};

use crate::db::Database;
use crate::types::common::ServerErr;
use crate::types::reqres::HostRes;


#[get("/api/game/{game_id}/host")]
pub async fn get(
    path: Path<String>,
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();

    let game_option = db.lock().get_game(game_id.clone());
    let host = if let Some(game) = game_option {
        game.host_id
    } else {
        return Err(ServerErr::NotFound(format!("game {} not found", game_id)));
    };

    Ok(HttpResponse::Ok().json(HostRes::create(host)))
}
