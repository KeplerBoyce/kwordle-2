use parking_lot::Mutex;
use actix_web::web::Data;
use actix_web::{HttpResponse, get};

use crate::sse::Broadcaster;
use crate::types::common::ServerErr;


#[get("/api/game/events")]
pub async fn get(
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let (rx, _) = broadcaster.lock().new_user_client("test".to_string());

    Ok(HttpResponse::Ok()
        .append_header(("content-type", "text/event-stream"))
        .streaming(rx)
    )
}
