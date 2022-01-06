import Potion from "../objects/Potion.js";
import PotionType from "../enums/PotionType.js";

export default class PotionFactory {
	/**
	 * Encapsulates the instantiation logic for creating birds.
	 * This method should be extended when adding new birds.
	 *
	 * @param {object} type Uses the PotionType enum.
	 * @returns An instance of a Potion.
	 */
	 static createInstance(dimensions, position,type) {
		return new Potion(dimensions, position,type);
	}
}