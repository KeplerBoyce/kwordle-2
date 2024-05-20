use parking_lot::Mutex;
use actix_web::web::{Data, Path};
use actix_web::{HttpResponse, get};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::Event;


#[get("/api/events/{id}")]
pub async fn get(
    path: Path<String>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let user_id: String = path.into_inner();
    let (rx, _) = broadcaster.lock().new_user_client(user_id.clone());

    if let Some(player) = db.lock().get_player_mut(user_id.clone()) {
        player.ready = true;
    }

    let id_option = db.lock().get_player_game_id(user_id.clone());
    if let Some(game_id) = id_option {
        if let Some(event) = db.lock().get_game_full_event(game_id) {
            broadcaster.lock().send_single(user_id, Event::GameFullEvent(event));
        }
    }

    Ok(HttpResponse::Ok()
        .append_header(("content-type", "text/event-stream"))
        .append_header(("transfer-encoding", "identity"))
        .streaming(rx)
    )
}
