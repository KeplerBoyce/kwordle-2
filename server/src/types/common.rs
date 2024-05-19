use std::{error::Error, fmt::{self, Display}};
use actix_web::http::{header::ContentType, StatusCode};
use actix_web::{HttpResponse, ResponseError};


#[derive(Debug)]
pub enum ServerErr {
    Internal(String),
    BadReq(String),
    Forbidden(String),
    NotFound(String),
}

impl Display for ServerErr {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", match self {
            ServerErr::Internal(x) => x,
            ServerErr::BadReq(x) => x,
            ServerErr::Forbidden(x) => x,
            ServerErr::NotFound(x) => x,
        })
    }
}

impl Error for ServerErr {}

impl ResponseError for ServerErr {
    fn status_code(&self) -> StatusCode {
        match *self {
            ServerErr::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ServerErr::BadReq(_) => StatusCode::BAD_REQUEST,
            ServerErr::Forbidden(_) => StatusCode::FORBIDDEN,
            ServerErr::NotFound(_) => StatusCode::NOT_FOUND,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::html())
            .body(self.to_string())
    }
}
