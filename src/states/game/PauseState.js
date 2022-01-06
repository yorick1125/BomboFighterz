import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import Arena from "../../objects/Arena.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
	stateMachine,
	timer
} from "../../globals.js";
import Player from "../../entities/Player.js";
import PotionFactory from "../../services/PotionFactory.js";
import Potion from "../../objects/Potion.js";
import {didSucceedPercentChance, getRandomPositiveInteger} from "../../../lib/RandomNumberHelpers.js"
import Timer from "../../../lib/Timer.js";
import Background from "../../objects/Background.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Sounds from "../../../lib/Sounds.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.pauseImage = new Background();
		this.pauseImage.sprite = new Sprite(images.get(ImageName.Pause),0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
	}

	enter(parameters) {
		this.arena = parameters.arena;
        this.timer = parameters.timer;
		sounds.stop(SoundName.Lessgo);
		sounds.pause(SoundName.Invincible);
		sounds.play(SoundName.Pause);
	}

	exit() {
		sounds.stop(SoundName.Pause);
		sounds.play(SoundName.Invincible);
	}

	update(dt) {
		//Unpause the game
		if(keys.Shift){
			keys.Shift = false;
            stateMachine.change(GameStateName.Play, {
                arena: this.arena,
                timer: this.timer
            });

		}

	}

	render() {
        this.pauseImage.render();
		
	}




}
