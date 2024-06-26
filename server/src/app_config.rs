use actix_web::web;

use crate::handlers::*;


pub fn config_app(cfg: &mut web::ServiceConfig) {
    cfg
        .service(create_game::post)
        .service(guess::post)
        .service(get_host::get)
        .service(new_client::get)
        .service(set_settings::post)
        .service(set_typing::post)
        .service(set_username::post)
        .service(start_game::post);
}
