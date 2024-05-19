use parking_lot::Mutex;
use actix_web::web::{Data, Json, Path};
use actix_web::{post, HttpResponse};

use crate::db::Database;
use crate::types::common::ServerErr;
use crate::types::reqres::{GameUsernamesRes, SetUsernameReq};


#[post("/api/game/{game_id}/user")]
pub async fn post(
    path: Path<String>,
    data: Json<SetUsernameReq>,
    db: Data<Mutex<Database>>,
) -> Result<HttpResponse, ServerErr> {

    let game_id: String = path.into_inner();
    let req_data: SetUsernameReq = data.into_inner();

    let usernames = db.lock().add_or_update_username(
        game_id,
        req_data.user_id,
        req_data.username,
    );

    Ok(HttpResponse::Ok().json(GameUsernamesRes::create(usernames)))
}
