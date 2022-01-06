import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine} from "../../globals.js";
import GameStateName from "../../enums/GameStateName.js";
import Arena from "../../objects/Arena.js";
import Background from "../../objects/Background.js";
import ImageName from "../../enums/ImageName.js";
import PlayerName from "../../enums/PlayerName.js";
import Player from "../../entities/Player.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Sprite from "../../../lib/Sprite.js";
import SoundName from "../../enums/SoundName.js";
import HighScoreManager from "../../../lib/HighScoreManager.js";
export default class GameOverState extends State {
	constructor() {
		super();

	}

	
	enter(parameters) {
		sounds.stop(SoundName.Invincible);
		this.arena = parameters.arena;
		this.winner = parameters.winner;
		this.winningPlayer = parameters.playerNumber + 1;
		this.winner.position = new Vector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
		HighScoreManager.addHighScore(this.winner.name, HighScoreManager.getHighScore(this.winner.name) + 1);
		//this.arena.objects.pop();
		switch(this.winner.name){
			case PlayerName.Drake :
				this.arena.background.sprite = new Sprite(images.get(ImageName.DrakeWin),0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
				sounds.play(SoundName.Started);
				break;
			case PlayerName.Wayne :
				this.arena.background.sprite = new Sprite(images.get(ImageName.WayneWin),0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
				sounds.play(SoundName.Milli);
				break;
			case PlayerName.Uzi :
				this.arena.background.sprite = new Sprite(images.get(ImageName.UziWin),0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
				sounds.play(SoundName.Xo);
				break;
			

		}
	}

	exit() {
		this.arena = new Arena();
		switch(this.winner.name){
			case PlayerName.Drake :
				sounds.stop(SoundName.Started);
				break;
			case PlayerName.Wayne :
				sounds.stop(SoundName.Milli);
				break;
			case PlayerName.Uzi :
				sounds.stop(SoundName.Xo);
				break;
			

		}
	}

	update(dt) {
		this.arena.update(dt);
		if (keys.Enter) {
			keys.Enter = false;
			stateMachine.change(GameStateName.CharacterSelect, {
				arena: this.arena
				
			});
		}

	}

	render() {
		this.arena.render();
		context.font = '50px Joystix';
		context.fillText("Player " + this.winningPlayer + " (" + this.winner.capitalizeName() +  ") wins!", CANVAS_WIDTH/2 - 55 , CANVAS_HEIGHT/2 - 100)
		context.font = '40px Joystix';
		context.fillText("Press enter to go back", CANVAS_WIDTH/2 , CANVAS_HEIGHT/2 +25)
		context.fillText(" to character selection ", CANVAS_WIDTH/2 , CANVAS_HEIGHT/2 + 65)
		// this.winner.renderFace();

	}
}
