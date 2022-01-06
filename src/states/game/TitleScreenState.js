import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine,
	sounds
} from "../../globals.js";
import Arena from "../../objects/Arena.js";
export default class StartState extends State {
	constructor() {
		super();

		// this.enter();
	
	}

	enter() {
		// this.arena = new Arena();
		sounds.play(SoundName.Invincible);
	}

	exit(){
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;
			stateMachine.change(GameStateName.CharacterSelect, {
			});
		}
	}

	render() {
		this.renderTitleWindow();
	}

	renderTitleWindow() {
		context.save();
		context.fillStyle = 'rgb(0,0,0, 0.5)';
		context.fillRect(30, 30, CANVAS_WIDTH - 60, CANVAS_HEIGHT - 60);
		context.font = '100px SSF4';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Bombo Fighterz', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
		context.font = '60px SSF4';
		context.fillText('Press Enter', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 150);
		context.restore();
	}

}
