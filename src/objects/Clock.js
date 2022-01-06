import { context, timer, CANVAS_WIDTH, CANVAS_HEIGHT, images } from "../globals.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import GameObject from "./GameObject.js";
import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import Potion from "./Potion.js";
import ImageName from "../enums/ImageName.js";
export default class Clock extends GameObject{
    static BORDER_RADIUS = 5;
    static WIDTH = 64;
    static HEIGHT = 64;
    static DEFAULT_TIME_LIMIT = 50;
    static DEFAULT_ROUNDS = 1;
	/**
	 * A UI element that gives us a list of textual items that link to callbacks;
	 * this particular implementation only has one dimension of items (vertically),
	 * but a more robust implementation might include columns as well for a more
	 * grid-like selection, as seen in many other kinds of interfaces and games.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, timeLimit = Clock.DEFAULT_TIME_LIMIT, rounds = Clock.DEFAULT_ROUNDS) {
		super(new Vector(width, height), new Vector(x, y));
        this.timeLimit = timeLimit;
        this.timeRemaining = timeLimit;
        this.rounds = rounds;
        this.currentRound = 1;
        this.gameStarted = false;


	}

    setTimeLimit(newLimit){
        this.timeLimit = newLimit;
        this.timeRemaining = newLimit;
        if(this.timeLimit < 10){
            this.timeLimit = 10;
            this.timeRemaining = 10;
        }
        if(this.timeLimit > 90){
            this.timeLimit = 90;
            this.timeRemaining = 90;
        }
    }

    nextRound(){
        this.currentRound += 1;
        this.timeRemaining = this.timeLimit;
    }

    update(dt){

    }


    passTime(){
        this.gameStarted = true;
        this.timeRemaining -= 1;
        if(this.timeRemaining < 0){
            this.timeRemaining = 0;
        }
    }

    render(){
        context.fillStyle = Colour.White
        context.font = '65px Joystix';
        context.fillText(this.timeRemaining, this.position.x-20, this.position.y)
        if(this.gameStarted){
            context.fillText("Round " + this.currentRound, this.position.x - Clock.WIDTH - 50, this.position.y + 50)
            context.font = '30px Joystix';
            context.fillText("Press Shift for Controls", this.position.x - Clock.WIDTH - 120, this.position.y + 85)
        }
    }
}