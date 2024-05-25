pub mod app_config;
pub mod db;
pub mod handlers;
pub mod hourglass;
pub mod types;
pub mod sse;
pub mod words;


pub fn calculate_score(
    num_guesses: i32,
    time: i32,
    round_time: i32,
    rank: i32,
) -> i32 {
    let guess_multiplier = match num_guesses {
        1 => 4.0,
        2 => 2.75,
        3 => 2.0,
        4 => 1.5,
        5 => 1.25,
        _ => 1.0,
    };
    let rank_bonus = match rank {
        1 => 50,
        2 => 25,
        3 => 10,
        _ => 0,
    };
    let base_score = 100.0 - 50.0 * time as f32 / round_time as f32;
    (base_score * guess_multiplier) as i32 + rank_bonus
}
