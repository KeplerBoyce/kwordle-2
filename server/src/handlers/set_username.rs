use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{ChangePlayersEvent, Event};
use crate::types::reqres::{SetUsernameReq, OK_RES};


#[post("/api/game/{game_id}/user")]
pub async fn post(
    path: Path<String>,
    data: Json<SetUsernameReq>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();
    let req_data: SetUsernameReq = data.into_inner();

    db.lock().add_player(
        req_data.user_id.clone(),
        game_id.clone(),
        broadcaster.clone(),
    );
    db.lock().add_or_update_username(
        game_id.clone(),
        req_data.user_id,
        req_data.username,
    );
    let players = db.lock().get_game_players(game_id.clone());
    let state = db.lock().get_game(game_id.clone()).unwrap().state;
    let event = Event::ChangePlayersEvent(ChangePlayersEvent::create(players, state));
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
