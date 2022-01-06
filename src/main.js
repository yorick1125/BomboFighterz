/**
 * Bombo Fighterz
 * 
 * Authors: Yorick-Ntwari Niyonkuru & Vathusan Vimalarajan
 * Sprites:
 * https://forums.rpgmakerweb.com/index.php?threads/mv-horror-hip-hop-characters-sprites-facesets-sideview.126350/
 * 
 * Music:
 * https://www.youtube.com/results?search_query=drake+started+from+the+bottom
 * https://www.youtube.com/watch?v=P19dow9ALYM
 * https://www.youtube.com/watch?v=WrsFXgQk5UI
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/game/PlayState.js";
import GameOverState from "./states/game/GameOverState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import CharacterSelectState from "./states/game/CharacterSelectState.js";
import PauseState from "./states/game/PauseState.js";

fetch('./src/config.json').then((response) => response.json()).then((response) => {
	// Fetch the asset definitions from config.json.
	const {
		images: imageDefinitions,
		fonts: fontDefinitions,
		sounds: soundDefinitions,
		// @ts-ignore
	} = response;

	// Load all the assets from their definitions.
	images.load(imageDefinitions);
	fonts.load(fontDefinitions);
	sounds.load(soundDefinitions);

	// Add all the states to the state machine.
	stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
	stateMachine.add(GameStateName.Play, new PlayState());
	stateMachine.add(GameStateName.CharacterSelect, new CharacterSelectState());
	stateMachine.add(GameStateName.GameOver, new GameOverState());
	stateMachine.add(GameStateName.Pause, new PauseState());

	stateMachine.change(GameStateName.TitleScreen);

	// Add event listeners for player input.
	canvas.addEventListener('keydown', event => {
		keys[event.key] = true;
	});

	canvas.addEventListener('keyup', event => {
		keys[event.key] = false;
	});

	const game = new Game(stateMachine, context, canvas.width, canvas.height);

	game.start();

	// Focus the canvas so that the player doesn't have to click on it.
	canvas.focus();
})

