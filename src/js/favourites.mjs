import ExternalServices from "./ExternalServices.mjs";
import RowListing from "./RowList.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const rowListing = new RowListing();
const services = new ExternalServices();
const favouritesContainer = document.querySelector(".favourites-container");

async function init() {
	await rowListing.renderFavouritesList(favouritesContainer);

	const deleteFavouriteBtns = document.querySelectorAll(".delete-favourite");
	console.log(deleteFavouriteBtns);

	deleteFavouriteBtns.forEach((btn) => {
		btn.addEventListener("click", async () => {
			console.log("Clicked");
			const favouriteId = btn.dataset.gameid;
			console.log(favouriteId);
			let favourites = getLocalStorage("favourites");
			if (favourites && favourites.find((item) => item === favouriteId)) {
				favourites = favourites.filter((item) => item !== favouriteId);
				setLocalStorage("favourites", favourites);

				// Remove from DOM and optionally re-render list
				await rowListing.renderFavouritesList(favouritesContainer);
				return;
			}
		});
	});
}

init();
