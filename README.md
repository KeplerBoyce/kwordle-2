# Kwordle.app v2
Several years ago in GunnHacks 8.0, I made [kwordle.app](https://github.com/keplerBoyce/gunnhacks8), a website for playing 1-on-1 online Wordle games against your friends. That was my first web development project and I have since gained a lot of experience and new skills in web development, so this project is a total rewrite of my original website.

You can play right now at [https://www.kwordle.app](https://www.kwordle.app/)!

### New features
Compared to the original kwordle.app, I have added a lot of new features:
- Supports up to 9 players in a game now instead of only 1-on-1
- Includes a lobby page where you can see the current players in the lobby and invite other players to join by link
- Added configurable lobby settings for number of rounds, round time, and time between rounds
- Added a more complex scoring system:
  - In the old scoring system, the first player to solve the Wordle puzzle would score one point, and the first to 5 points would win
  - In the new scoring system, players now earn points with a formula based on the number of guesses they used, how long they took to solve it, and their relative speed compared to the other players in the lobby
  - With this formula, solving the puzzle in fewer guesses is more beneficial than solving it quickly -- the old kwordle.app had an issue where typing the same 4-word sequences to cover a lot of letters then solving on the 5th guess was almost always the best way to solve faster than the opponent
- Added a results page where you can see a summary of the whole game and how you and your friends scored on each round

### Changes to tech stack
For the original kwordle.app, I used vanilla HTML/JS and an Express backend, using WebSocket (Socket.io) to communicate between the clients and the server. I have since spent a lot of time using React, so I switched to Next.js with TailwindCSS for the frontend of the new kwordle.app. For the backend, I switched to Actix, as I have been liking Rust a lot as a backend language -- its memory safety and expressive type system make it really nice for building a REST API in my opinion. Instead of using WebSocket, I switched to Server-Sent Events, in which the clients all listen to an event stream that the server populates. The clients then send regular HTTP requests to the backend to communicate when they type in letters, make guesses, leave the game, and so on, and the backend broadcasts events to all clients so that each client can receive updates about all of the other players' actions.
