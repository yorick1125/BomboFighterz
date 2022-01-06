
/**
 * This class is responsible for reading and writing the high scores
 * of our game to and from the browser's local storage. Local storage
 * is a simple way to store small key/value pairs (kind of like cookies)
 * for a particular domain on your browser.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
export default class HighScoreManager {
	static loadHighScores() {
		/**
		 * Since the high scores are being saved as a string containing JSON,
		 * we must parse the string into a valid JavaScript object in order
		 * to manipulate it.
		 */
		 const highScores = JSON.parse(localStorage.getItem('highScores')) ?? [];
		//  const highScores = [];		 

		if (highScores.length === 0) {
			// // If there are no scores, we want to populate the scores array with placeholders.
			highScores.push({name: "drake", score: 0})
			highScores.push({name: "uzi", score: 0})
			highScores.push({name: "wayne", score: 0})

			/**
			 * Since the high scores are represented as a JavaScript object,
			 * we must turn the object into a string in order to be able to
			 * save it using local storage.
			 */
			localStorage.setItem('highScores', JSON.stringify(highScores));
		}

		return highScores;
	}

	static addHighScore(name, score) {
		let highScores = HighScoreManager.loadHighScores();

		highScores.forEach((highScore) => {
			if(highScore.name == name){
				highScore.score++;
			}
		})


		/**
		 * Since the high scores are represented as a JavaScript object,
		 * we must turn the object into a string in order to be able to
		 * save it using local storage.
		 */
		localStorage.setItem('highScores', JSON.stringify(highScores));
	}

	static getHighScore(name) {
		let highScores = HighScoreManager.loadHighScores();

		switch(name){
			case "drake":
				return highScores[0].score;
				break;
			case "uzi":
				return highScores[1].score;
				break;
			case "wayne":
				return highScores[2].score;
				break;
		}

		return 0;
	}
}
