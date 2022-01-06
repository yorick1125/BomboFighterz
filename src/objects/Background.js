import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js";

export default class Background {
	static WIDTH = CANVAS_WIDTH;
	static HEIGHT = CANVAS_HEIGHT;
	static CAMERA_SCALE = 10;

	/**
	 * Responsible for rendering the background sprite.
	 * Uses the camera to offset its position to create
	 * a parallax effect.
	 *
	 */
	 constructor() {
		this.position = new Vector(0, 0);
		this.dimensions = new Vector(Background.WIDTH, Background.HEIGHT);
		this.sprite = Background.generateSprites();
	}

	update(dt) {

	}

	render() {
		this.sprite.render(this.position.x, this.position.y);
	} 

	static generateSprites() {
		return new Sprite(images.get(ImageName.Background), 0, 0, Background.WIDTH, Background.HEIGHT);
	}

	addCamera(camera) {
		this.camera = camera;
	}


}
