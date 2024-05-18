use actix_web::web;

use crate::handlers::*;


pub fn config_app(cfg: &mut web::ServiceConfig) {
    cfg
        .service(create_game::get)
        .service(new_client::get);
}
