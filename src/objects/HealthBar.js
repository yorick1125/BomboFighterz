import { context, timer, CANVAS_WIDTH, CANVAS_HEIGHT, images } from "../globals.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import GameObject from "./GameObject.js";
import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import Potion from "./Potion.js";
import ImageName from "../enums/ImageName.js";
export default class HealthBar extends GameObject{
    static BORDER_RADIUS = 5;
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
	constructor(x, y, width, height, player) {
		super(new Vector(width, height), new Vector(x, y));
        this.player = player;
        this.currentValue = this.player.health;
        this.maxValue = this.player.maxHealth;
        this.color = Colour.Green;
        this.ratio = 1;
        this.tweening = false;
        this.startLevel = this.player.level

	}

	update(dt) {
        this.tweenHealth();

	}

    tweenHealth(){
        // if health has changed
        if( this.currentValue != this.player.health && !this.tweening){
            this.tweening = true;
            timer.tween(this, ['currentValue'], [this.player.health], 0.5, () => {
                this.tweening = false;
            });
        }
    }


	render() {
        let currentColor = context.fillStyle;
        context.fillStyle = Colour.White;
        context.font = '45px Zig';
        context.fillText(this.player.capitalizeName(), this.position.x, this.position.y + this.dimensions.y + 40);
        // console.log(this.player.roundsWon);
        // context.fillText("Rnds Won: " + this.player.roundsWon, this.position.x - 0, this.position.y + this.dimensions.y + 90);

        roundedRectangle(
			context,
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			HealthBar.BORDER_RADIUS,
			true,
			true
		);
        context.fillStyle = this.getColor();
        if(this.notEmpty()){
            this.ratio = this.getHealthRatio();
            roundedRectangle(
                context,
                this.position.x+1,
                this.position.y+1,
                this.dimensions.x * this.currentValue / this.maxValue - 2,
                this.dimensions.y-2,
                2,
                true,
                false
            );
        }
        context.font = '30px Zig';
        context.fillStyle = Colour.Chartreuse;
        let potionImgX = this.position.x;
        let potionImgY = this.position.y + 117;
        let textX = this.position.x + Potion.WIDTH + 4;
        let textY = this.position.y + this.dimensions.y + 125;
        let potionSprites = Potion.generateSprites();
        let txt = "";
        if(this.player.attackBoost){
            potionSprites[0].render(potionImgX, potionImgY)
            txt = "Attack Boost";
        }
        if(this.player.defenseBoost){
            potionSprites[1].render(potionImgX, potionImgY)
            txt = "Defense Boost";
        }
        if(this.player.speedBoost){
            potionSprites[2].render(potionImgX, potionImgY)
            txt = "Speed Boost";
        }
        context.fillText(txt, textX, textY);
        context.fillStyle = currentColor;
	}

    getColor(){
        if(this.player.isLowHealth()){
            return Colour.Red;
        }
        else if(this.player.isHalfHealth()){
            return Colour.Yellow;
        }
        else{
            return Colour.Green;
        }
    }

    getHealthRatio(){
        return this.player.health / this.player.maxHealth;
    }


    notEmpty(){
        return this.player.health > 0;
    }

}
