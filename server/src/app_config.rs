use actix_web::web;

use crate::handlers::*;


pub fn config_app(cfg: &mut web::ServiceConfig) {
    cfg
        .service(create_game::post)
        .service(new_client::get)
        .service(set_username::post)
        .service(start_game::post);
}
