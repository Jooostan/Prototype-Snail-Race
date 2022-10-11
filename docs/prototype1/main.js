title = "Prototype 1";

description = `Testin shit
`;

characters = [
`
 rrrrr
 rLLLr
 rLLLr
 rrrrr
 r   r
`
];

// -GLOBAL-CONSTANTS-----------------------------------
const G = {
	// Screen Size
	WIDTH: 150,
	HEIGHT: 100,
	HEIGHT_OFFSET: 4,
	
	// Player Info
	PLAYER_POS_X: (150/2),
	PLAYER_POS_Y: (100/2) - 10,
	PLAYER_MIN_BASE_SPEED: 0.5,
	PLAYER_MAX_BASE_SPEED: 5.0,
	PLAYER_PLATFORM_OFFSET: 2,

	// Platform Speed
	PLATFORM_MIN_BASE_SPEED: 0.5,

	// Gravity
	GRAVITY: 0.3
};

options = {
	viewSize: {x: G.WIDTH, y:G.HEIGHT}
};

// -TYPE-STUFF-----------------------------------------
/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * dir: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * }} Platform
 */

/**
 * @type { Platform }
 */
let platform;

// ----------------------------------------------------

function update() {
	if (!ticks) {
		// Player Initialization
		player = {
			pos: vec(G.PLAYER_POS_X - 20, G.PLAYER_POS_Y),
			speed: G.PLAYER_MIN_BASE_SPEED,
			dir: 0
		};

		// Platform Initialization
		platform = {
			pos: vec(G.WIDTH/2, G.HEIGHT/2),
			speed: G.PLATFORM_MIN_BASE_SPEED
		};
		
	}
	// -END-OF-INIT-----------------------------------
	
	color ("black");
	box(G.WIDTH/2, G.HEIGHT/2 + G.HEIGHT_OFFSET, G.WIDTH/4, 2);

	// Player Stuff: Color, Sprite, Clamping
	color("black");
	char("a", player.pos);
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

	// Player Movement Left & Right
	if(player.dir === 0){
		player.pos.x += player.speed;
		if(player.pos.x === G.WIDTH){
			player.dir = 1;
		}
	} else{
		player.pos.x -= player.speed;
		if(player.pos.x === 0){
			player.dir = 0;
		}
	}

	// Player Gravity?
	// player.pos.y += G.GRAVITY;

	const isCollidingWithPlatform = char("a", player.pos).isColliding.rect.black;
	if(isCollidingWithPlatform){
		player.pos.y = platform.pos.y;
	} else{
		// player.pos.y += G.GRAVITY;
	}
// -END-OF-UPDATE-------------------------------------

// http://localhost:4000/?prototype1
}
