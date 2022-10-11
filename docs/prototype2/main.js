title = "Prototype 2 - Snail Race";

description = `
[Mash] Run
`;

characters = [
`
   y y
   y y
LLLy y
LLLyyy
LLLyyy
yyyyyy
`
,
`
bbbbbb
bbLbLb
bbLbLb
bbbbbb
bbbbbb
 b  b
`
,
`
bbbbbb
bbLbLb
bbLbLb
bbbbbb
bbbbbb
 b    
`
,
`
bbbbbb
bbLbLb
bbLbLb
bbbbbb
bbbbbb
    b 
`
,
`
   L  
  rL  
 rrL  
rrrL  
   L  
  LLL 
`
];

// -TYPE-STUFF-----------------------------------------
/**
 * @typedef {{
 * pos: Vector
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Snail
 */

/**
 * @type { Snail }
 */
let snail;

let count;
let count2;
let sec;
let text_sec;
let wins;

// -GLOBAL-CONSTANTS-----------------------------------
const G = {
	// Screen Size
	WIDTH: 150,
	HEIGHT: 100,

	// UI
	TIMER_POS_X: 3,
	TIMER_POS_Y: 10,
	
	// Player Info
	PLAYER_POS_X: 10,
	PLAYER_POS_Y: (100/3) * 2,
	PLAYER_MOVE: 3,

	// Snail
	SNAIL_POS_X: 10,
	SNAIL_POS_Y: (100/3),
	SNAIL_SPEED: 0.05,

	// Track!
	TRACK_POS_X: 5,
	TRACK_HEIGHT: 7,
	TRACK_WIDTH: 140,

	FLAG: 140
};

// ----------------------------------------------------

options = { // 1? 8? 15? 3? 4?
	seed: 4,
	viewSize: {x: G.WIDTH, y:G.HEIGHT},
	isPlayingBgm: true,
	isReplayEnabled: true,
	theme: "crt",
	isDrawingParticleFront: true
};

function update() {
	if (!ticks) {
		// Player Initialization
		player = {
			pos: vec(G.PLAYER_POS_X, G.PLAYER_POS_Y)
		};

		snail = {
			pos: vec(G.SNAIL_POS_X, G.SNAIL_POS_Y),
			speed: G.SNAIL_SPEED * difficulty
		}

		count = 30;
		count2 = 60;
		sec = 0;
		text_sec = 0;
		wins = 0;
	}
	// -END-OF-INIT-----------------------------------

	// Track
	color("light_yellow");
	rect(G.TRACK_POS_X, player.pos.y - 2, G.TRACK_WIDTH, G.TRACK_HEIGHT);
	rect(G.TRACK_POS_X, snail.pos.y - 2, G.TRACK_WIDTH, G.TRACK_HEIGHT);
	
	// Sprites
	color("black");
	char("e", G.WIDTH - 10, G.SNAIL_POS_Y); // Flag
	char("e", G.WIDTH - 10, G.PLAYER_POS_Y); // Flag
	char("a", snail.pos); // Snail
	char("b", player.pos); // Player
	
	// // Time Stuff
	// text("Time:", G.TIMER_POS_X, G.TIMER_POS_Y);
	// count2--;
	// if(count2 == 0){
	// 	count2 = 60;
	// 	sec++;
	// 	text_sec = sec.toString();
	// }

	// // Timer Text
	text("Wins: ", G.TIMER_POS_X, G.TIMER_POS_Y)
	text(wins.toString(),G.TIMER_POS_X + 33, G.TIMER_POS_Y);

	// Snail Colliding w/ Flag
	const SnailCollidingWithFlag = char("a", snail.pos).isColliding.char.e;
	if(SnailCollidingWithFlag){
		play("powerUp");
		end();
	}

	// Player Colliding w/ Flag
	const PlayerCollidingWithFlag = char("b", player.pos).isColliding.char.e;
	if(PlayerCollidingWithFlag){
		addScore(Math.floor(snail.pos.distanceTo(G.FLAG, G.PLAYER_POS_Y)), G.WIDTH/2, G.HEIGHT/2 + 15);
		color("yellow")
		play("coin");
		player.pos.x = G.PLAYER_POS_X;
		snail.pos.x = G.SNAIL_POS_X;
		wins++;

	}

	// Player Movement
	if(input.isJustPressed){
		player.pos.x += G.PLAYER_MOVE;
		particle(
			// player.pos.x, // x coordinate
			// player.pos.y, // y coordinate
			player.pos.x - 5,
			player.pos.y,
			10, // The number of particles
			1  , // The speed of the particles
			PI, // The emitting angle
			PI/4 // The emitting width
		);
	}
	// Snail Movement
	if(wins != 0){
		snail.pos.x += G.SNAIL_SPEED * wins;
		if(wins > 3 && wins < 5){
			color("yellow")
		}
		else if(wins >= 5){
			color("red");
		}
		particle(
			snail.pos.x - 4,
			snail.pos.y,   
			15, // The number of particles
			0.75, // The speed of the particles
			PI, // The emitting angle
			PI/3 // The emitting width
		);
		
	} else {
		snail.pos.x += G.SNAIL_SPEED;
		particle(
			snail.pos.x - 5,
			snail.pos.y,
			15, // The number of particles
			0.75, // The speed of the particles
			PI, // The emitting angle
			PI/3 // The emitting width
		);
	}

// -END-OF-UPDATE-------------------------------------

// if player wins, speed up the snail!
// get as many points before the snail finishes?
// point value gained determined by how far the snail was from the goal?
}
