import { CANVAS_HEIGHT, FLOOR, keys } from "../../globals.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import Player from "../../entities/Player.js";
import Vector from "../../../lib/Vector.js";

export default class PlayerFallingState extends State {
	/**
	 * In this state, the player is travelling down towards the ground.
	 * Once they hit the ground, they are either idle if X velocity is zero,
	 * or walking if left or right are being pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 0.1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
	}

	update(dt) {
		// this.player.velocity.add(this.player.gravityForce, dt);

		// if(this.player.position.y + this.player.dimensions.y >= FLOOR + Player.HEIGHT ){
		// 	this.player.changeState(PlayerStateName.Idle);
		// }
		if(this.player.position.y + this.player.dimensions.y <= FLOOR){
			this.player.velocity.add(this.player.gravityForce, dt);
		}
		else{
			this.player.changeState(PlayerStateName.Idle);
		}

		//this.player.checkEntityCollisions(entity => this.onEntityCollision(entity));
		//this.player.checkObjectCollisions(object => this.onObjectCollision(object));
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		if(this.player.number == 1){
			if (keys.a) {
				this.player.moveLeft();
			}
			else if (keys.d) {
				this.player.moveRight();
			}
			else if (keys[' ']) {
				keys[' '] = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.e) {
				keys.e = false;
				this.player.shootSpecialAttack();
		   	}
			else {
				this.player.stop();
			}
		}
		else if(this.player.number == 2){
			if (keys.ArrowLeft) {
				this.player.moveLeft();
			}
			else if (keys.ArrowRight) {
				this.player.moveRight();
			}
			else if (keys.ArrowDown) {
				keys.ArrowDown = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if(keys.Shift){
				keys.Shift = false;
				this.player.shootSpecialAttack();
			}
			else {
				this.player.stop();
			}
		}
		this.player.checkConsumables();

	}



}
