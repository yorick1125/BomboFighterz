import Sprite from "../../../lib/Sprite.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import ImageName from "../../enums/ImageName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine,
	sounds,
	images
} from "../../globals.js";
import Arena from "../../objects/Arena.js";
import Direction from "../../enums/Direction.js";
import Clock from "../../objects/Clock.js";
import Colour from "../../enums/Colour.js";
import HighScoreManager from "../../../lib/HighScoreManager.js";
import Sounds from "../../../lib/Sounds.js";

export default class CharacterSelectState extends State {
	constructor() {
		super();
	}

	enter() {
		sounds.play(SoundName.Invincible);
		this.arena = new Arena();
		this.arrowSprites = Sprite.generateArrowSprites();
		this.player1 = new Player(new Vector(Player.WIDTH*2, Player.HEIGHT*2), new Vector(200, 32), "drake", 1);
		this.player2 = new Player(new Vector(Player.WIDTH*2, Player.HEIGHT*2), new Vector(CANVAS_WIDTH - 200, 32), "uzi", 2);
		this.player2.direction = Direction.Left;
		this.highScores = HighScoreManager.loadHighScores();
		console.log(this.highScores)
	}

	exit(){
		sounds.play(SoundName.Lessgo);
	}

	update(dt) {
		if (keys.Enter) {
			keys.Enter = false;
			this.arena.addEntity(this.player1);
			this.arena.addHealthBar(this.player1)
			this.arena.addEntity(this.player2);
			this.arena.addHealthBar(this.player2)
			this.arena.startMatch();
			stateMachine.change(GameStateName.Play, {
                arena: this.arena
			});
		}
		if(keys.a){
			keys.a = false;
			this.player1.previousPlayer();
		}
		if(keys.d){
			keys.d = false;
			this.player1.nextPlayer();
		}
		if(keys.ArrowLeft){
			keys.ArrowLeft = false;
			this.player2.previousPlayer();
		}
		if(keys.ArrowRight){
			keys.ArrowRight = false;
			this.player2.nextPlayer();
		}
		if(keys.p){
			keys.p = false;
			this.arena.clock.setTimeLimit(this.arena.clock.timeLimit + 1);
		}
		if(keys.o){
			keys.o = false;
			this.arena.clock.setTimeLimit(this.arena.clock.timeLimit - 1);
		}
		if(keys.l){
			keys.l = false;
			this.arena.clock.rounds = 3;
		}
		if(keys.k){
			keys.k = false;
			this.arena.clock.rounds = 1;
		}
		if(keys.n){
			keys.n = false;
			this.arena.itemsOn = true;
		}
		if(keys.m){
			keys.m = false;
			this.arena.itemsOn = false;
		}
	}

	render() {
		this.arena.render();

		context.fillStyle = Colour.White
        context.font = '50px Chrusty';


		// Time Limit 
		context.fillText("    Press O", CANVAS_WIDTH/2 - 480, Clock.HEIGHT/3 + 40);
		this.arrowSprites[0].render(this.arena.clock.position.x - Clock.WIDTH-20, Clock.HEIGHT/3, {x: 2, y: 2});
		this.arrowSprites[1].render(this.arena.clock.position.x + Clock.WIDTH*2-20, Clock.HEIGHT/3, {x: 2, y: 2});
		context.fillText("Press P", CANVAS_WIDTH/2 + 235, Clock.HEIGHT/3 + 40);

		//Rounds
        context.font = '75px Joystix';
        context.fillText(this.arena.clock.rounds, this.arena.clock.position.x + Clock.WIDTH/2 - 20, Clock.HEIGHT*2 + 10)
        context.font = '50px Chrusty';
		context.fillText("    Press K", CANVAS_WIDTH/2 - 480, Clock.HEIGHT/3 + 120);
		this.arrowSprites[0].render(this.arena.clock.position.x - Clock.WIDTH-20, Clock.HEIGHT/3 + 75, {x: 2, y: 2});
		this.arrowSprites[1].render(this.arena.clock.position.x + Clock.WIDTH*2-20, Clock.HEIGHT/3 + 75, {x: 2, y: 2});
		context.fillText("Press L", CANVAS_WIDTH/2 + 235, Clock.HEIGHT/3 + 120);

		//Items
		if(this.arena.itemsOn){
			context.fillText("Items On", this.arena.clock.position.x + Clock.WIDTH/2 - 100, Clock.HEIGHT*2 + 90)
		}
		else{
			context.fillText("Items Off", this.arena.clock.position.x + Clock.WIDTH/2 - 100, Clock.HEIGHT*2 + 90)
		}
		context.fillText("    Press N", CANVAS_WIDTH/2 - 480, Clock.HEIGHT/3 + 200);
		this.arrowSprites[0].render(this.arena.clock.position.x - Clock.WIDTH-120, Clock.HEIGHT/3 + 155, {x: 2, y: 2});
		this.arrowSprites[1].render(this.arena.clock.position.x + Clock.WIDTH*2 + 80, Clock.HEIGHT/3 + 155, {x: 2, y: 2});
		context.fillText("Press M", CANVAS_WIDTH/2 + 235, Clock.HEIGHT/3 + 200);

		// Player 1 
		this.player1.renderName(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.6);
		this.arrowSprites[0].render(CANVAS_WIDTH * 0.15, CANVAS_HEIGHT * 0.8, {x: 2, y: 2});
		this.player1.renderFace(CANVAS_WIDTH * 0.20, CANVAS_HEIGHT * 0.7);
		context.fillText("Games Won: " + HighScoreManager.getHighScore(this.player1.name), CANVAS_WIDTH * 0.15, CANVAS_HEIGHT * 0.99)
		this.arrowSprites[1].render(CANVAS_WIDTH * 0.35, CANVAS_HEIGHT * 0.8, {x: 2, y: 2});

		// Player 2 
		this.player2.renderName(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.6);
		this.arrowSprites[0].render(CANVAS_WIDTH * 0.65, CANVAS_HEIGHT * 0.8, {x: 2, y: 2});
		this.player2.renderFace(CANVAS_WIDTH * 0.7, CANVAS_HEIGHT * 0.7);
		context.fillText("Games Won: " + HighScoreManager.getHighScore(this.player2.name), CANVAS_WIDTH * 0.65, CANVAS_HEIGHT * 0.99)
		this.arrowSprites[1].render(CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * 0.8, {x: 2, y: 2});
	}

}
