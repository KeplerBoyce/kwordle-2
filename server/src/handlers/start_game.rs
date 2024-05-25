use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{HttpResponse, post};

use crate::db::Database;
use crate::hourglass::Hourglass;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::data::GameState;
use crate::types::events::{Event, StartGameEvent};
use crate::types::reqres::{StartGameReq, OK_RES};


#[post("/api/game/{game_id}/start")]
pub async fn post(
    path: Path<String>,
    data: Json<StartGameReq>,
    db: Data<Mutex<Database>>,
    hourglass: Data<Mutex<Hourglass>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();
    let req_data = data.into_inner();

    let game_option = db.lock().get_game(game_id.clone());
    if let Some(game) = game_option {
        if game.host_id != req_data.host_id {
            return Err(ServerErr::UnAuth(format!("user ID does not match host ID in database")));
        }
        db.lock().set_game_state(game_id.clone(), GameState::PreRound);
        hourglass.lock().set_glass(game_id.clone(), game.pre_round_time);
    } else {
        return Err(ServerErr::NotFound(format!("game {} not found", game_id)));
    }

    let event = Event::StartGameEvent(StartGameEvent::create());
    broadcaster.lock().send_game(db.clone(), game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
