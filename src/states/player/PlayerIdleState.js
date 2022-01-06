import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import { keys } from "../../globals.js";
import Vector from "../../../lib/Vector.js";
export default class PlayerIdleState extends State {
	/**
	 * In this state, the player is stationary unless
	 * left or right are pressed, or if there is no
	 * collision below.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = new Animation([0], 1);
	}

	enter() {
		this.player.velocity.y = 0;
		this.player.velocity.x = 0;
		this.player.currentAnimation = this.animation;
	}

	update(dt) {

		if(this.player.number == 1){
			if (keys.a || keys.d) {
				this.player.changeState(PlayerStateName.Walking);
			}
	
	
			if (keys.w) {
			 	this.player.changeState(PlayerStateName.Jumping);
			}
			else if (keys.g) {
				keys.g = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.h) {
				keys.h = false;
				this.player.shootSpecialAttack();
		   	}
		}
		if(this.player.number == 2){
			if (keys.ArrowLeft || keys.ArrowRight) {
				this.player.changeState(PlayerStateName.Walking);
			}
	
			if (keys.ArrowUp) {
			 	this.player.changeState(PlayerStateName.Jumping);
			}
			else if (keys.o) {
				keys.o = false;
				this.player.changeState(PlayerStateName.Attacking);
		   	}
			else if (keys.p) {
				keys.p = false;
				this.player.shootSpecialAttack();
		   	}
		}
		this.player.checkConsumables();

	}

}
