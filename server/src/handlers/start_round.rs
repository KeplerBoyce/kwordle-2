use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{HttpResponse, post};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{Event, StartGameEvent};
use crate::types::reqres::{StartGameReq, OK_RES};


#[post("/api/game/{game_id}/round/start")]
pub async fn post(
    path: Path<String>,
    data: Json<StartGameReq>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();
    let req_data = data.into_inner();
    let host_id = db.lock().get_game_host_id(game_id.clone());

    if host_id.is_none() || host_id.unwrap() != req_data.host_id {
        return Err(ServerErr::UnAuth(format!("user ID does not match host ID in database")));
    }
    db.lock().start_game(game_id.clone());
    let event = Event::StartGameEvent(StartGameEvent::create());
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
