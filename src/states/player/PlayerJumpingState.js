import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { keys } from "../../globals.js";
import Player from "../../entities/Player.js";


export default class PlayerJumpingState extends State {
	/**
	 * In this state, the player gets a sudden vertical
	 * boost. Once their Y velocity reaches 0, they start
	 * to fall.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([11], 1);
	}

	enter() {
		if(this.player.hurting){
			this.player.hurting = false;
		}
		else{
			this.player.velocity.y = this.player.jumpForce.y;
		}
		this.player.currentAnimation = this.animation;

	}

	exit(){
	}

	update(dt) {

		if (this.player.velocity.y >= 0) {
			this.player.changeState(PlayerStateName.Falling);
		}

		if(this.player.number == 1){
			if (keys.a) {
				this.player.moveLeft();
				this.player.checkLeftCollisions();
			}
			else if (keys.d) {
				this.player.moveRight();
				this.player.checkRightCollisions();
			}
			else if (keys.g) {
				keys.g = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.h) {
				keys.h = false;
				this.player.shootSpecialAttack();
		   	}
			else {
				this.player.stop();
			}
		}

		else if(this.player.number == 2){
			if (keys.ArrowLeft) {
				this.player.moveLeft();
				this.player.checkLeftCollisions();
			}
			else if (keys.ArrowRight) {
				this.player.moveRight();
				this.player.checkRightCollisions();
			}
			else if (keys.o) {
				keys.o = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.p) {
				keys.p = false;
				this.player.shootSpecialAttack();
		   	}
			else {
				this.player.stop();
			}

		}
		this.player.checkConsumables();
		this.player.velocity.add(this.player.gravityForce, dt);


	}



	onObjectCollision(object) {
		if (object.didCollideWithEntity(this.player)) {
			if (object.isSolid && object.getEntityCollisionDirection(this.player) === Direction.Down) {
				object.onCollision(this.player);

				this.player.position.y = object.position.y + object.dimensions.y;
				this.player.velocity.y = 0;
				this.player.changeState(PlayerStateName.Falling);
			}
			else if (object.isConsumable) {
				object.onConsume(this.player);
			}
		}
	}
}
