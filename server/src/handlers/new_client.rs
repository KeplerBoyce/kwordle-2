use parking_lot::Mutex;
use actix_web::web::{Data, Path};
use actix_web::{HttpResponse, get};

use crate::sse::Broadcaster;
use crate::types::common::ServerErr;


#[get("/api/events/{id}")]
pub async fn get(
    path: Path<String>,
    broadcaster: Data<Mutex<Broadcaster>>,
) -> Result<HttpResponse, ServerErr> {

    let user_id: String = path.into_inner();
    let (rx, _) = broadcaster.lock().new_user_client(user_id);

    Ok(HttpResponse::Ok()
        .append_header(("content-type", "text/event-stream"))
        .streaming(rx)
    )
}
