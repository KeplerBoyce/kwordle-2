use std::env;
use dotenv::dotenv;
use actix_cors::Cors;
use actix_web::{middleware, App, HttpServer};

use server::app_config::config_app;
use server::db::Database;
use server::hourglass::Hourglass;
use server::sse::Broadcaster;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let host = env::var("HOST").unwrap();
    let port = env::var("PORT").unwrap().parse::<u16>().unwrap();
    
    let db = Database::create();
    let broadcaster = Broadcaster::create();
    let hourglass = Hourglass::create(db.clone(), broadcaster.clone());

    env::set_var("RUST_LOG", "debug");
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    log::info!("starting HTTP server at {}:{}", host, port);

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .app_data(db.clone())
            .app_data(broadcaster.clone())
            .app_data(hourglass.clone())
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(config_app)
    })
    .bind((host, port))?
    .run()
    .await
}
