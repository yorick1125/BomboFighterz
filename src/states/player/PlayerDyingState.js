import { CANVAS_HEIGHT, keys, FLOOR } from "../../globals.js";
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
		this.animation = new Animation([15, 36, 42, 44, 51, 52, 53], 0.1, 1);
	}

	enter() {
		this.player.currentAnimation = this.animation;
		this.player.velocity.x = 0;
		this.player.velocity.y = 0;
	}

	update(dt) {
		if(this.player.position.y + this.player.dimensions.y <= FLOOR){
			this.player.position.add(this.player.gravityForce, dt);
		}
		this.player.checkLeftCollisions();
		this.player.checkRightCollisions();
		if (this.player.currentAnimation.isDone()) {
			//this.player.currentAnimation.refresh();
			this.player.isDead = true;
		}

	}
}
