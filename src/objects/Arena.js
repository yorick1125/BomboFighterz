import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, timer } from "../globals.js";
import Background from "./Background.js";
import Clock from "./Clock.js";
import HealthBar from "./HealthBar.js";
import Player from "../entities/Player.js"
import PlayerStateName from "../enums/PlayerStateName.js";
import Direction from "../enums/Direction.js";

export default class Arena {


    constructor(entities = [], objects = []){
        this.background = new Background();
        this.entities = entities;
        this.objects = objects;
        this.clock = new Clock(CANVAS_WIDTH/2 - Clock.WIDTH/2, Clock.HEIGHT, Clock.WIDTH, Clock.HEIGHT, Clock.DEFAULT_TIME_LIMIT)
        this.addObject(this.clock);
        this.itemsOn = true;
    }

    update(dt){
        this.cleanUpEntitiesAndObjects();
        timer.update(dt);
        this.background.update(dt);
        this.objects.forEach((object) => {
			object.update(dt);
		});

		this.entities.forEach((entity) => {
			entity.update(dt);
		});



    }

    startMatch(){
        timer.addTask(() => {
            this.clock.passTime();
        }, 1)
    }

    getPlayer1(){
        return this.entities[0];
    }
    getPlayer2(){
        return this.entities[1];
    }

    getWinner(){
        
        let player1 = this.entities[0];
        let player2 = this.entities[1];
        if(player1.roundsWon == player2.roundsWon){
            return player2.damageReceived > player1.damageReceived ? player1 : player2;
        }
        return player1.roundsWon > player2.roundsWon ? player1 : player2;
    }

    getPlayerNumber(){
       return this.entities.indexOf(this.getWinner());
    }

    checkGameOver(){

        if(this.clock.timeRemaining == 0 ||this.getPlayer1().isDead || this.getPlayer2().isDead){
            this.nextRound();
        }

        if(this.clock.currentRound <= this.clock.rounds){
            
            return  this.getPlayer1().roundsWon > 1 ||  this.getPlayer2().roundsWon > 1 ;
        }
       
        return this.clock.currentRound > this.clock.rounds;
    }

    nextRound(){
        
        this.clock.nextRound();
        
        if(this.getPlayer1().isDead){
            this.removeHealthBar(this.entities[0]);
            let roundsWon = this.entities[0].roundsWon;
            this.entities[1].win();
            this.entities[0] = new Player(new Vector(Player.WIDTH*2, Player.HEIGHT*2), new Vector(200, 32), this.getPlayer1().name, 1);
            this.entities[1].position.x = CANVAS_WIDTH - 200;
            this.entities[1].position.y = 32;
            this.entities[1].changeState(PlayerStateName.Falling);
            this.entities[0].arena = this;
            this.entities[0].roundsWon = roundsWon;
            this.addHealthBar(this.entities[0]);
        }
        else if(this.getPlayer2().isDead){
            this.removeHealthBar(this.entities[1]);
            let roundsWon = this.entities[0].roundsWon;
            this.entities[0].win();
            this.entities[1] = new Player(new Vector(Player.WIDTH*2, Player.HEIGHT*2), new Vector(CANVAS_WIDTH - 200, 32), this.getPlayer2().name, 2);
            this.entities[1].direction = Direction.Left;
            this.entities[0].position.x =  200;
            this.entities[0].position.y = 32;
            this.entities[0].changeState(PlayerStateName.Falling);
            this.entities[1].arena = this;
            this.entities[1].roundsWon = roundsWon;
            this.addHealthBar(this.entities[1]);
        }
    }
    render(){
        this.background.render();
        this.objects.forEach((object) => {
			object.render();
		});

		this.entities.forEach((entity) => {
			entity.render();
		});


    }

    reset(){
        this.entities = [];
        this.objects = [];

    }

    cleanUpEntitiesAndObjects() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
		this.objects = this.objects.filter((object) => !object.cleanUp);
	}


    addEntity(entity){
        entity.arena = this;
        this.entities.push(entity);
    }

    addObject(object){
        this.objects.push(object);
    }

    addHealthBar(entity){
        if(entity.number == 1){
            this.addObject(new HealthBar(20, 20, 350, 20, entity))
        }
        else if(entity.number == 2){
            this.addObject(new HealthBar(CANVAS_WIDTH - 360, 20, 350, 20, entity))
        }
    }

    removeHealthBar(entity){
        this.objects.forEach((object) => {
            if(object instanceof HealthBar && object.player == entity){
                this.objects.slice(this.objects.indexOf(object));
            }
        });
    }

}