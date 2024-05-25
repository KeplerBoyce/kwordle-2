use std::cell::RefCell;
use std::env;
use std::rc::Rc;
use actix_web::web::Data;
use dotenv::dotenv;
use actix_cors::Cors;
use actix_web::{middleware, App, HttpServer};

use parking_lot::Mutex;
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
    let hg_rc: Rc<RefCell<Option<Data<Mutex<Hourglass>>>>> = Rc::new(RefCell::new(None));
    let broadcaster = Broadcaster::create(db.clone(), hg_rc.clone());
    let hourglass = Hourglass::create(db.clone(), broadcaster.clone());
    let _ = hg_rc.borrow_mut().insert(hourglass.clone());

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
