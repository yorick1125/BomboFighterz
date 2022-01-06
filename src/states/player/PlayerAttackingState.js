import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds, FLOOR } from "../../globals.js";
export default class PlayerAttackingState extends State {
	/**
	 * In this state, the player swings their sword out in
	 * front of them. This creates a temporary hitbox that
	 * enemies can potentially collide into.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation = new Animation([0, 1, 2, 3, 4, 5], 0.05, 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
		
	}

	exit() {

	}

	update(dt) {
		// Idle once one sword swing animation cycle has been played.     
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			if(this.player.velocity.y > 0 || this.player.velocity.y < 0){
				this.player.changeState(PlayerStateName.Falling)
			}
			else if(this.player.velocity.y == 0){
				this.player.changeState(PlayerStateName.Idle);
			}
		}

		// if came from falling state
		if(this.player.velocity.y > 0 || this.player.velocity.y < 0){
			if(this.player.position.y + this.player.dimensions.y <= FLOOR){
				this.player.velocity.add(this.player.gravityForce, dt);
			}
			else{
				this.player.changeState(PlayerStateName.Idle);
			}
		}


		/**
		 * Only set the sword's hitbox halfway through the animation.
		 * Otherwise, it will look like the enemy died as soon as the
		 * animation started which visually doesn't really make sense.
		 */
		if (this.player.currentAnimation.isHalfwayDone()) {
			this.player.checkAttackCollisions();
		}
	}


}
