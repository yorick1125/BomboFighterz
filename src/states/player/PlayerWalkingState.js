import { keys } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import Vector from "../../../lib/Vector.js";


export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player is on the ground and moving
	 * either left or right. From here, the player can go idle
	 * if nothing is being pressed and there is no X velocity.
	 * The player can fall if there is no collisions below them,
	 * and they can jump if they hit spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([3, 4, 5], 0.2);
	}

	enter() {

		this.player.sprites = this.player.walkingSprites;
		this.player.currentAnimation = this.animation;

	}

	exit(){
		this.player.generateSprites();
	}

	update(dt) {


		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		if(this.player.number == 1){
			// moving
			if (keys.w) {
				this.player.changeState(PlayerStateName.Jumping);
			}
	
			if (!keys.a && !keys.d && Math.abs(this.player.velocity.x) === 0) {
				this.player.changeState(PlayerStateName.Idle);
			}
			else if (keys.a) {
				this.player.moveLeft();
			}
			else if (keys.d) {
				this.player.moveRight();
			}
			else {
				this.player.stop();
			}
			if (keys.g) {
				keys.g = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.h) {
				keys.h = false;
				this.player.shootSpecialAttack();
		   	}
		}
		else if(this.player.number == 2){
			// movement
			if (keys.ArrowUp) {
				this.player.changeState(PlayerStateName.Jumping);
			}
	
			if (!keys.ArrowLeft && !keys.ArrowRight && Math.abs(this.player.velocity.x) === 0) {
				this.player.changeState(PlayerStateName.Idle);
			}
			else if (keys.ArrowLeft) {
				this.player.moveLeft();
			}
			else if (keys.ArrowRight) {
				this.player.moveRight();
			}
			else {
				this.player.stop();
			}

			// attacking
			if (keys.p) {
				keys.p = false;
				this.player.shootSpecialAttack();
		   	}
			   else if (keys.o) {
				keys.o = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			
		}
		this.player.checkConsumables();


	}


}
