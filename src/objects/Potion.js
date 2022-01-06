import GameObject from "./GameObject.js";
import { images, sounds,FLOOR } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import PotionType from "../enums/PotionType.js";
import Player from "../entities/Player.js";


export default class Potion extends GameObject {
	static WIDTH = 32;
	static HEIGHT = 32;
	static TOTAL_SPRITES = 1;
	

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, type) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Potion.generateSprites();

		this.type = type;
		
		this.currentFrame = type;
		this.gravityforce = new Vector(0,200);
		
		
	}

	update(dt) {
		
		if(this.position.y + Potion.HEIGHT <= FLOOR){
			this.position.add(this.gravityforce,dt);
		}
		
	}

	onConsume(player) {
		if (this.wasConsumed) {
			return;
		}
		super.onConsume();
		switch(this.type){
			case PotionType.Attack:
				player.boostAttack();
				break;
			case PotionType.Defense:
				player.boostDefense();
				break;
			case PotionType.Speed:
				player.speedUp();
				break;
			case PotionType.Health:
				player.heal();
				break;

		}
		this.cleanUp = true;
	}

	static generateSprites() {
		const sprites = [];

		sprites.push(new Sprite(
			images.get(ImageName.AttackPotion),
			0,
			0,
			Potion.WIDTH,
			Potion.HEIGHT
		));
		sprites.push(new Sprite(
			images.get(ImageName.DefensePotion),
			0,
			0,
			Potion.WIDTH,
			Potion.HEIGHT
		));
		sprites.push(new Sprite(
			images.get(ImageName.SpeedPotion),
			0,
			0,
			Potion.WIDTH,
			Potion.HEIGHT
		));
		sprites.push(new Sprite(
			images.get(ImageName.HealthPotion),
			0,
			0,
			Potion.WIDTH,
			Potion.HEIGHT
		));
		return sprites;
	}
}