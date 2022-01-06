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

export default class PlayState extends State {

	static POTION_SPAWN_INTERVAL = 5;

	constructor() {
		super();
		
		
	}

	enter(parameters) {
		this.arena = parameters.arena;
		this.timer = parameters.timer ?? new Timer();
		if(this.arena.itemsOn){
			this.startTimer();
		}
	}

	exit() {

	}

	update(dt) {

		//Pause the game
		if(keys.Shift){
			keys.Shift = false;
			stateMachine.change(GameStateName.Pause, {
				arena: this.arena,
				timer: this.timer
			})
		}
		this.arena.update(dt);
		this.timer.update(dt);
		if(this.arena.checkGameOver()){
			let winner  = this.arena.getWinner();
			let playerNumber = this.arena.getPlayerNumber();
			this.arena.reset();
			stateMachine.change(GameStateName.GameOver, {
				arena: this.arena,
				winner: winner,
				playerNumber: playerNumber
			});
		}

	}

	render() {
		this.arena.render();
	}

	startTimer(){
		this.timer.addTask(() => {
			if(didSucceedPercentChance(0.25)){
				this.arena.objects.push(PotionFactory.createInstance(
					new Vector(16,16),
					new Vector(getRandomPositiveInteger(0,CANVAS_WIDTH-Potion.WIDTH),0),
					getRandomPositiveInteger(0,3)
				))
			}
		}, PlayState.POTION_SPAWN_INTERVAL);
	}


}
