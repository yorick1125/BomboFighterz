import GameObject from "./GameObject.js";
import { CANVAS_WIDTH, images, sounds, timer } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Entity from "../entities/Entity.js";
import Player from "../entities/Player.js";
import Direction from "../enums/Direction.js";
import { didSucceedPercentChance } from "../../lib/RandomNumberHelpers.js";

export default class Fireball extends GameObject {
	static WIDTH = 16;
	static HEIGHT = 16;
	static TOTAL_SPRITES = 4;

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, direction, player) {
		super(dimensions, position);

        this.player = player;
		this.isConsumable = true;
        this.velocity = new Vector(0, 0);
        this.speedScalar = 5;
		this.frictionScalar = 0.9;
        this.velocityLimit = 100;
		switch(this.player.name){
			case "drake":
				this.sprites = Fireball.generateSprites(5);
				break;
			case "uzi":
				this.sprites = Fireball.generateSprites(1);
				break;
			case "wayne":
				this.sprites = Fireball.generateSprites(0);
				break;
		}
		this.animation = new Animation([0, 1, 2, 3], 0.2);
        this.direction = direction;
	}

	update(dt) {
		this.animation.update(dt);
		this.currentFrame = this.animation.getCurrentFrame();
        if(this.direction == Direction.Right){
			timer.tween(this.position, ['x', 'y'], [CANVAS_WIDTH, this.position.y], 0.5, () => {
				this.cleanUp = true;
            });
        }
        else{
			timer.tween(this.position, ['x', 'y'], [0, this.position.y], 0.5, () => {
				this.cleanUp = true;
            });
        }
	}

    onConsume(entity){
        super.onConsume(entity);
		entity.receiveDamage(this.player, 5);
    }

	render(){
		super.render({x: 3, y: 3});
	}

    onCollision(collider){
        super.onCollision(collider);
    }

	static generateSprites(colorCode = 3) {
		const sprites = [];

		for (let x = 0; x < Fireball.TOTAL_SPRITES; x++) {
			sprites.push(new Sprite(
				images.get(ImageName.Fireballs),
				x * Fireball.WIDTH,
				Fireball.HEIGHT * colorCode,
				Fireball.WIDTH,
				Fireball.HEIGHT
			));
		}

		return sprites;
	}
}
