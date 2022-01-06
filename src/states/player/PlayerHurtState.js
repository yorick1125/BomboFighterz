import Animation from "../../../lib/Animation.js";
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import Direction from "../../enums/Direction.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds, FLOOR } from "../../globals.js";
import PlayState from "../game/PlayState.js";
export default class PlayerHurtState extends State {
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

		this.animation = new Animation([15, 36, 42, 44], 0.1, 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
		this.player.hurting = true;
	}

	exit() {
	}

	update(dt) {

		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();

		// Go back once one hurting animation cycle has been played.     
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Falling);
		}

		// if came from falling state
		if(this.player.velocity.y > 0){
			if(this.player.position.y + this.player.dimensions.y <= FLOOR){
				this.player.velocity.add(this.player.gravityForce, dt);
			}
			else{
				this.player.changeState(PlayerStateName.Idle);
			}
		}



	}


}
