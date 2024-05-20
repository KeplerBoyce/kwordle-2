use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{ChangePlayersEvent, Event};
use crate::types::reqres::{GuessReq, OK_RES};


#[post("/api/game/{game_id}/user/{user_id}/guess")]
pub async fn post(
    path: Path<(String, String)>,
    data: Json<GuessReq>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let (game_id, user_id): (String, String) = path.into_inner();
    let req_data: GuessReq = data.into_inner();

    db.lock().add_player_guess(game_id.clone(), user_id, req_data.guess);
    let players = db.lock().get_game_players(game_id.clone());
    let event = Event::ChangePlayersEvent(ChangePlayersEvent::create(players));
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
