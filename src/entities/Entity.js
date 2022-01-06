import Direction from "../enums/Direction.js";
import { context } from "../globals.js";
import Vector from "../../lib/Vector.js";
import { isAABBCollision } from "../../lib/CollisionHelpers.js";

export default class Entity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {Vector} dimensions The height and width of the entity.
	 * @param {Vector} position The x and y coordinates of the entity.
	 * @param {Vector} velocityLimit The maximum speed of the entity.
	 * @param {Arena} arena The arena that the entity lives in.
	 */
	constructor(dimensions, position, velocityLimit, arena) {
		this.dimensions = dimensions;
		this.position = position;
		this.velocity = new Vector(0, 0);
		this.velocityLimit = velocityLimit;
		this.arena = arena;
		this.direction = Direction.Right;
		this.sprites = [];
		this.currentAnimation = null;
		this.stateMachine = null;
		this.isDead = false;
		this.cleanUp = false;
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}

	update(dt) {
		this.stateMachine.update(dt);
		this.currentAnimation.update(dt);
		this.position.add(this.velocity, dt);
	}

	render(isWalking) {
		this.stateMachine.render();

		if (this.isDead) {
			return;
		}

		this.renderEntity(isWalking);
	}


	/**
	 * Draw character, this time getting the current frame from the animation.
	 * We also check for our direction and scale by -1 on the X axis if we're facing left.
	 */
	renderEntity(isWalking) {
		let scale = {x: 2, y: 2};
		if(isWalking){
			scale = {x: 2.5, y: 2.5};
		}
		if (this.direction === Direction.Right) {
			context.save();
			context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
			context.scale(-1, 1);

			this.sprites[this.currentAnimation.getCurrentFrame()].render(0, 0, scale);
			context.restore();
		}
		else {
			this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.position.x), Math.floor(this.position.y), scale);
		}
	}

	/**
	 * @param {Entity} entity
	 * @returns Whether this entity collided with another using AABB collision detection.
	 */
	didCollideWithEntity(entity) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			entity.position.x,
			entity.position.y,
			entity.dimensions.x,
			entity.dimensions.y,
		);
	}

	/**
	 * @param {Entity} entity
	 * @returns The horizontal distance between this entity and the specified entity.
	 */
	getDistanceBetween(entity) {
		return Math.abs(this.position.x - entity.position.x);
	}





}
