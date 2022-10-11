// The title of the game to be displayed on the title screen
title = "ヾ(•ω•`)o";

// The description, which is also displayed on the title screen
description = `
Destroy enemies.
`;

// The array of custom sprites
characters = [
`
  ll
  ll
ccllcc
ccllcc
ccllcc
cc  cc
`,`
rr  rr
rrrrrr
rrpprr
rrrrrr
  rr  
  rr
`,`
y  y
yyyyyy
 y  y
yyyyyy
 y  y
`
];

// Game runtime options
// Refer to the official documentation for all available options
const G = {
		WIDTH: 100,
		HEIGHT: 150,
		
		STAR_SPEED_MIN: 0.5,
		STAR_SPEED_MAX: 1.0,

		PLAYER_FIRE_RATE: 4,
		PLAYER_GUN_OFFSET: 3,

		FBULLET_SPEED: 5,

		ENEMY_FIRE_RATE: 45,
		EBULLET_SPEED: 2.0,
		EBULLET_ROTATION: 0.1

};

const H = {
		ENEMY_MIN_BASE_SPEED: 1.0,
		ENEMY_MAX_BASE_SPEED: 2.0
};

options = {
		viewSize: {x: G.WIDTH, y: G.HEIGHT},
		seed: 2,
		isPlayingBgm: true
};


/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star []}
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBullet []}
 */
let fBullets;

/**
 * @typedef {{
 * pos: Vector
 * firingCooldown
 * }} Enemy
 */

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { Enemy []}
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

// The game loop function
function update() {
	// THe init function
	if (!ticks) {
		// times function
		// 1st input (number): number of times to perform second action
		// 2nd input (function): a function that returns an object 
		stars = times(20, () => {
			// variables to hold new posX & new posY
			const posX = rnd(0, G.WIDTH);
			const posY = rnd(0, G.HEIGHT);
			return{
				// new vector object, returning newly random values
				pos: vec(posX, posY),
				speed: rnd(0.5, 1.0)
			};
		});

		player = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
			firingCooldown: G.PLAYER_FIRE_RATE,
			isFiringLeft: true
		};

		fBullets = [];
		eBullets = [];
		enemies = [];

		waveCount = 0;
		currentEnemySpeed = 0;
	}

	// update stuff
	stars.forEach((s) => {
		// Move the star downwards
		s.pos.y += s.speed
		// Bring the star back to top once it's past the bottom
		s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		// Choose a color to draw
		color("light_black");
		// Draw the star as a square of size 1
		box(s.pos, 1);
	})

	// Updating the player position
	player.pos = vec(input.pos.x, input.pos.y);
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

	// Cooling down for the next shot
	player.firingCooldown--;

	//Time to fire the next shot
	if(player.firingCooldown <= 0){
		// Get the side from which the bullet is fired
		const offset = (player.isFiringLeft)
			? -G.PLAYER_GUN_OFFSET
			: G.PLAYER_GUN_OFFSET;
		// Create the bullet
		fBullets.push({
			pos: vec(player.pos.x + offset, player.pos.y)
		});
		// Reset the firing cooldown
		player.firingCooldown = G.PLAYER_FIRE_RATE;
		// Switch the side of the firing gun by flipping the boolean
		player.isFiringLeft = !player.isFiringLeft;

		color("yellow");
		// Generate particles
		particle(
			player.pos.x + offset, // x coordinate
			player.pos.y, // y coordinate
			4, // The number of particles
			1, // The speed of the particles
			-PI/2, // The emitting angle
			PI // The emitting width
		);
	}
	color("black");
	char("a", player.pos);

	// Updating and drawing bullets
	fBullets.forEach((fb) => {
		// Move the bullets upwards
		fb.pos.y -= G.FBULLET_SPEED;

		// Drawing
		color("yellow");
		box(fb.pos, 2);
	})

	if(enemies.length === 0){
		currentEnemySpeed =
			rnd(H.ENEMY_MIN_BASE_SPEED, H.ENEMY_MAX_BASE_SPEED) * difficulty;
		for (let i = 0; i < 9; i++){
			const posX = rnd(0, G.WIDTH);
			const posY = -rnd(i * G.HEIGHT * 0.1);
			enemies.push({ pos: vec(posX, posY), firingCooldown: G.ENEMY_FIRE_RATE})
		}

		waveCount++;
	}

	remove(fBullets, (fb) => {
		return fb.pos.y < 0;
	});
	// text(fBullets.length.toString(), 3, 10);
	remove(enemies, (e) => {
		e.pos.y += currentEnemySpeed;
		e.firingCooldown--;
		if(e.firingCooldown <= 0){
			eBullets.push({
				pos: vec(e.pos.x, e.pos.y),
				angle: e.pos.angleTo(player.pos),
				rotation: rnd()
			});
			e.firingCooldown = G.ENEMY_FIRE_RATE;
			play("select");
		}
		color("black");
		const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;

		if(isCollidingWithFBullets) {
			color("yellow");
			particle(e.pos);
			play("explosion");
			addScore(10 * waveCount, e.pos);
		}

		const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
		if(isCollidingWithPlayer){
			end();
			play("powerUp");
		}

		return(isCollidingWithFBullets || e.pos.y > G.HEIGHT);
	});

	remove(fBullets, (fb) => {
		color("yellow");
		const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
		return (isCollidingWithEnemies || fb.pos.y < 0);
	})

	remove(eBullets, (eb) => {
		eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
		eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
		eb.rotation += G.EBULLET_ROTATION_SPD;

		color("red");
		const isCollidingWithPlayer
			= char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;
		
			if (isCollidingWithPlayer){
				// end the game
				end();
				play("powerUp");
			}

			return(!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT));
	})
	
	remove(eBullets, (eb) => {
		const isCollidingWithFBullets
			= char("c", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
		if(isCollidingWithFBullets){
			addScore(1, eb.pos);
			return true;
		}
	});

}
