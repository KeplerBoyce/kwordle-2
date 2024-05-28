use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{ChangeSettingsEvent, Event};
use crate::types::reqres::{SetSettingsReq, OK_RES};


#[post("/api/game/{game_id}/settings")]
pub async fn post(
    path: Path<String>,
    data: Json<SetSettingsReq>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();
    let req_data: SetSettingsReq = data.into_inner();

    let event = Event::ChangeSettingsEvent(ChangeSettingsEvent::create(
        req_data.rounds,
        req_data.round_time,
        req_data.pre_round_time,
    ));
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
