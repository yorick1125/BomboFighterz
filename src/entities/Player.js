import Entity from "./Entity.js";
import Sprite from "../../lib/Sprite.js";
import StateMachine from "../../lib/StateMachine.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { CANVAS_WIDTH, FLOOR, images, keys, sounds, stateMachine, timer, DEBUG } from "../globals.js";
import PlayerIdleState from "../states/player/PlayerIdleState.js";
import PlayerAttackingState from "../states/player/PlayerAttackingState.js";
import PlayerJumpingState from "../states/player/PlayerJumpingState.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerFallingState from "../states/player/PlayerFallingState.js";
import PlayerDyingState from "../states/player/PlayerDyingState.js";
import GameObject from "../objects/GameObject.js";
import GameStateName from "../enums/GameStateName.js";
import { context } from "../globals.js";
import PlayerHurtState from "../states/player/PlayerHurtState.js";
import Fireball from "../objects/Fireball.js";

export default class Player extends Entity {
	static WIDTH = 64;
	static HEIGHT = 64;
	static DRAKE_WALKING_WIDTH = 50;
	static DRAKE_WALKING_HEIGHT = 50;
	static UZI_WALKING_WIDTH = 48;
	static UZI_WALKING_HEIGHT = 48;
	static TOTAL_SPRITES = 11;
	static VELOCITY_LIMIT = 500;
	static MAXHEALTH = 100;
	static LOW_HEALTH_THRESHOLD = 0.25;
	static HALF_HEALTH_THRESHOLD = 0.5;
	static JUMPFORCE_Y = -550;
	static DEFAULT_DAMAGE = 2/5;
	/**
	 * The hero character the player controls in the map.
	 * Has the ability to jump and will collide into tiles
	 * that are collidable.
	 *
	 * @param {Vector} dimensions The height and width of the player.
	 * @param {Vector} position The x and y coordinates of the player.
	 * @param {String} name The name of the player.
	 * @param {String} number The number of the player.
	 */
	constructor(dimensions, position, name, number) {
		super(dimensions, position, new Vector(Player.VELOCITY_LIMIT, Player.VELOCITY_LIMIT));

		this.gravityForce = new Vector(0, 1000);
		this.speedScalar = 100;
		this.frictionScalar = 0.9;

		this.jumpForce = new Vector(0, Player.JUMPFORCE_Y);

		this.name = name;
		this.sprites = [];
		this.faceSprites = [];
		this.walkingSprites = [];
		this.generateSprites();
		this.number = number;
		this.maxHealth = Player.MAXHEALTH;
		this.health = Player.MAXHEALTH;
		this.hurting = false;
		this.stateMachine = new StateMachine();
		this.stateMachine.add(PlayerStateName.Attacking, new PlayerAttackingState(this));
		this.stateMachine.add(PlayerStateName.Hurting, new PlayerHurtState(this));
		this.stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		this.stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
		this.stateMachine.add(PlayerStateName.Falling, new PlayerFallingState(this));
		this.stateMachine.add(PlayerStateName.Dying, new PlayerDyingState(this));
		this.stateMachine.add(PlayerStateName.Jumping, new PlayerJumpingState(this));
		this.fireballs = 10
		this.changeState(PlayerStateName.Falling);
		this.attackBoost = false;
		this.defenseBoost = false;
		this.speedBoost = false;
		this.score = 0;
		this.damageReceived = 0;

		this.roundsWon = 0;
		this.shootingCooldown = false;

	}

	/**
	 * Loops through the character sprite sheet and
	 * retrieves each sprite's location in the sheet.
	 *
	 * @returns The array of sprite objects.
	 */
	generateSprites() {
		switch(this.name){
			case "drake":
				this.sprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.DrakeFull),
					Player.WIDTH,
					Player.HEIGHT
				)
				this.faceSprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.DrakeFace),
					Player.WIDTH * 2,
					Player.HEIGHT * 2
				)
				this.walkingSprites = Sprite.generateWalkingSprites(
					images.get(ImageName.DrakeWalk),
					Player.DRAKE_WALKING_WIDTH,
					Player.DRAKE_WALKING_HEIGHT
				)
				break;
			case "uzi":
				this.sprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.UziFull),
					Player.WIDTH,
					Player.HEIGHT
				)
				this.faceSprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.UziFace),
					Player.WIDTH * 2,
					Player.HEIGHT * 2
				)
				this.walkingSprites = Sprite.generateWalkingSprites(
					images.get(ImageName.UziWalk),
					Player.UZI_WALKING_WIDTH,
					Player.UZI_WALKING_HEIGHT
				)
				break;
			case "wayne":
				this.sprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.WayneFull),
					Player.WIDTH,
					Player.HEIGHT
				)
				this.faceSprites = Sprite.generateSpritesFromSpriteSheet(
					images.get(ImageName.WayneFace),
					Player.WIDTH * 2,
					Player.HEIGHT * 2
				)
				this.walkingSprites = Sprite.generateWalkingSprites(
					images.get(ImageName.WayneWalk),
					Player.DRAKE_WALKING_WIDTH,
					Player.DRAKE_WALKING_HEIGHT
				)
				break;
		}
	}

	static generateWalkingSprites() {
		const sprites = [];

		
		for (let i = 0; i < Player.TOTAL_SPRITES; i++) {
			sprites.push(new Sprite(
				images.get(ImageName.Character),
				i * Player.WIDTH,
				0,
				Player.WIDTH,
				Player.HEIGHT,
			));
		}

		return sprites;
	}


	update(dt){
		super.update(dt);
	}

	render(){
		let isWalking = this.stateMachine.currentState instanceof PlayerWalkingState;
		super.render(isWalking);
	}

	capitalizeName(){
		return this.name.replace(/^\w/, c => c.toUpperCase());
	}
	renderName(x = this.position.x, y = this.position.y){
		
		context.save();
		context.font = '60px Joystix';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(this.capitalizeName(), x, y);
		context.restore();
		
	}

	renderFace(x = this.position.x, y = this.position.y){
		this.faceSprites[0].render(x, y);
	}

	moveLeft() {
		this.direction = Direction.Left;
		this.velocity.x = Math.max(this.velocity.x - this.speedScalar, -this.velocityLimit.x);
	}

	moveRight() {
		this.direction = Direction.Right;
		this.velocity.x = Math.min(this.velocity.x + this.speedScalar, this.velocityLimit.x);
	}

	win(){
		this.roundsWon += 1;
	}

	stop() {
		if (Math.abs(this.velocity.x) > 0) {
			this.velocity.x *= this.frictionScalar;
		}

		if (Math.abs(this.velocity.x) < 0.1) {
			this.velocity.x = 0;
		}
	}

	nextPlayer(){
		switch(this.name){
			case "drake":
				this.name = "uzi";
				break;
			case "uzi":
				this.name = "wayne";
				break;
			case "wayne":
				this.name = "drake";
				break;
		}
		this.generateSprites();
	}

	previousPlayer(){
		switch(this.name){
			case "drake":
				this.name = "wayne";
				break;
			case "uzi":
				this.name = "drake";
				break;
			case "wayne":
				this.name = "uzi";
				break;
		}
		this.generateSprites();
	}

	isLowHealth() {
		const percentage = this.health / this.maxHealth;

		return percentage <= Player.LOW_HEALTH_THRESHOLD && percentage > 0;
	}

	isHalfHealth() {
		const percentage = this.health / this.maxHealth;

		return percentage <= Player.HALF_HEALTH_THRESHOLD && percentage > 0;
	}

	shootSpecialAttack(){
		switch(this.name){
			case "drake":
				sounds.play(SoundName.Yeye);
				break;
			case "uzi":
				sounds.play(SoundName.Reeee);
				break;
			case "wayne":
				sounds.play(SoundName.Yessir);
				break;
		}
		if(this.shootingCooldown == false){
			let fireballVelocityX = this.direction == Direction.Right ? 1 : -1;
			this.arena.objects.push(new Fireball(this.dimensions, new Vector(this.position.x + ((this.dimensions.x - 20) * fireballVelocityX), this.position.y + this.dimensions.y/2), this.direction, this));
			this.shootingCooldown = true;
			timer.wait(0.75, () => {
				this.shootingCooldown = false;
			});
			this.stateMachine.change(PlayerStateName.Attacking)
		}


	}

	receiveDamage(attacker, damage = 2/5){
		if(this == attacker){
			return;
		}


		if(attacker.attackBoost){
			damage *= 2;
		}
		if(this.defenseBoost){
			damage /= 2;
		}
		this.health -= damage;
		this.damageReceived += damage;
		if(this.health > 0){
			// Recoil 
			if(attacker.direction == Direction.Right){
				this.velocity.x = Math.min(this.velocity.x/1.25 + this.speedScalar, this.velocityLimit.x);
				this.checkRightCollisions();
			}
			else if(attacker.direction == Direction.Left){
				this.velocity.x = Math.max(this.velocity.x/ 1.25 - this.speedScalar, -this.velocityLimit.x);
				this.checkLeftCollisions();
			}
			this.velocity.y = this.jumpForce.y/5;
			this.changeState(PlayerStateName.Hurting);
		}
		else{
			this.velocity.y = this.gravityForce.y;
			this.changeState(PlayerStateName.Dying);
		}
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the left edge of the map.
	 *   2. Overlapping with collidable tiles on the left.
	 *   3. Overlapping with collidable solid game objects on the left.
	 */
	checkLeftCollisions() {
		if (this.position.x < 0) {
			this.velocity.x = 0;
			this.position.x = 0;
		}
	
	}

	/**
	 * Restrict the player from:
	 *   1. Going off the right edge of the map.
	 *   2. Overlapping with collidable tiles on the right.
	 *   3. Overlapping with collidable solid game objects on the right.
	 */
	checkRightCollisions() {
		if (this.position.x > CANVAS_WIDTH - this.dimensions.x) {
			this.velocity.x = 0;
			this.position.x = CANVAS_WIDTH - this.dimensions.x;
		}
		
	}

	checkConsumables(){
        this.arena.objects.forEach((object) => {
            if (object.didCollideWithEntity(this) && object.isConsumable) {
                object.onConsume(this);
            }
        });
    }

	checkAttackCollisions() {
		this.arena.entities.forEach((entity) => {
			if (this === entity) {
				return;
			}

			if (entity.didCollideWithEntity(this)) {
				sounds.play(SoundName.Punch);
				entity.receiveDamage(this);
			}
		});
	}

	boostAttack(){
		this.attackBoost = true;
		this.defenseBoost = false;
		this.speedBoost = false;
		timer.wait(10,() => {
			this.attackBoost = false;
		})
	}

	boostDefense(){
		this.defenseBoost = true;
		this.attackBoost = false;
		this.speedBoost = false;
		timer.wait(10,() => {
			this.defenseBoost = false;
		})
	}

	heal(){
		this.health += 20;
		if(this.health > Player.MAXHEALTH){
			this.health = Player.MAXHEALTH;
		}
		
	}

	speedUp(){
		this.speedBoost = true;
		this.attackBoost = false;
		this.defenseBoost = false;
		this.velocityLimit = new Vector(Player.VELOCITY_LIMIT * 3,Player.VELOCITY_LIMIT * 3);
		this.speedScalar *= 3;
		this.jumpForce = new Vector(0, Player.JUMPFORCE_Y * 1.5);
		timer.wait(10,() => {
			this.speedBoost = false;
			this.velocityLimit = new Vector(Player.VELOCITY_LIMIT,Player.VELOCITY_LIMIT);
			this.speedScalar = 100;
			this.jumpForce = new Vector(0, Player.JUMPFORCE_Y);

		})
	}
}
