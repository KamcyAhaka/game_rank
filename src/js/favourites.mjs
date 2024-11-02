import ExternalServices from "./ExternalServices.mjs";
import RowListing from "./RowList.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const rowListing = new RowListing();
const services = new ExternalServices();
const favouritesContainer = document.querySelector(".favourites-container");

async function init() {
	rowListing.renderFavouritesList(favouritesContainer);

	const deleteFavouriteBtns = document.querySelectorAll(".delete-favourite");

	deleteFavouriteBtns.forEach((btn) => {
		const favouriteId = btn.dataset.gameId;
		let favourites = getLocalStorage("favourites");
		if (favourites && favourites.find((item) => item === favouriteId)) {
			favourites = favourites.filter((item) => item !== favouriteId);
			setLocalStorage("favourites", favourites);
			return;
		}
	});
}

init();
