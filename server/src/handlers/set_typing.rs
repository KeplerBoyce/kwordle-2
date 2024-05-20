use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{Event, TypingEvent};
use crate::types::reqres::{TypingReq, OK_RES};


#[post("/api/game/{game_id}/user/{user_id}/typing")]
pub async fn post(
    path: Path<(String, String)>,
    data: Json<TypingReq>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let (game_id, user_id): (String, String) = path.into_inner();
    let req_data: TypingReq = data.into_inner();

    if let Some(player) = db.lock().get_player_mut(user_id.clone()) {
        player.typing = req_data.typing;
    }

    let event = Event::TypingEvent(TypingEvent::create(user_id, req_data.typing));
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
