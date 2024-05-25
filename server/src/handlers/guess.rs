use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::calculate_score;
use crate::db::Database;
use crate::hourglass::Hourglass;
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
    hourglass: Data<Mutex<Hourglass>>,
) -> Result<HttpResponse, ServerErr> {

    let (game_id, user_id): (String, String) = path.into_inner();
    let req_data: GuessReq = data.into_inner();

    let game = if let Some(g) = db.lock().get_game(game_id.clone()) {
        g
    } else {
        return Err(ServerErr::NotFound(format!("game {} not found", game_id)));
    };
    
    let mut solved = false;
    if let Some(player) = db.lock().get_player_mut(user_id) {
        player.guesses.push(req_data.guess.clone());
        if req_data.guess == game.word {
            solved = true;
            let sand_left = hourglass.lock().get_sand_left(game_id.clone()).unwrap();
            let time = game.round_time - sand_left;
            player.score += calculate_score(player.guesses.len() as i32, time, game.round_time, game.num_solved + 1);
        }
    }
    if solved {
        db.lock().get_game_mut(game_id.clone()).unwrap().num_solved += 1;
        let game = db.lock().get_game(game_id.clone()).unwrap();
        if game.num_solved == game.players.len() as i32 {
            hourglass.lock().set_glass(game_id.clone(), 0);
        }
    }

    let players = db.lock().get_game_players(game_id.clone());
    let event = Event::ChangePlayersEvent(ChangePlayersEvent::create(players));
    broadcaster.lock().send_game(db, game_id, event);

    Ok(HttpResponse::Ok().json(OK_RES))
}
