use parking_lot::Mutex;
use actix_web::web::{Data, Path};
use actix_web::{HttpResponse, get};

use crate::db::Database;
use crate::sse::Broadcaster;
use crate::types::common::ServerErr;
use crate::types::events::{ChangePlayersEvent, Event, NewWordEvent};


#[get("/api/events/{id}")]
pub async fn get(
    path: Path<String>,
    db: Data<Mutex<Database>>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let user_id: String = path.into_inner();
    let (rx, _) = broadcaster.lock().new_user_client(user_id.clone());

    if db.lock().ready_player(user_id.clone()) {
        let game_id = db.lock().get_player_game_id(user_id);
        if let Some(id) = game_id {
            let new_word_event = Event::NewWordEvent(NewWordEvent::create());
            broadcaster.lock().send_game(db.clone(), id.clone(), new_word_event);

            let players = db.lock().get_game_players(id.clone());
            let change_players_event = Event::ChangePlayersEvent(ChangePlayersEvent::create(players));
            broadcaster.lock().send_game(db, id, change_players_event);
        }
    }

    Ok(HttpResponse::Ok()
        .append_header(("content-type", "text/event-stream"))
        .append_header(("transfer-encoding", "identity"))
        .streaming(rx)
    )
}
