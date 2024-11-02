import ExternalServices from "./ExternalServices.mjs";
import RowListing from "./RowList.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const tableBody = document.querySelector("#table-body");
const fetchMoreTrigger = document.querySelector("#fetch-more");

const rowListing = new RowListing(tableBody);

const services = new ExternalServices();
const sortPreferenceInput = document.querySelector(".sort-preference");

async function init() {
	await rowListing.init();

	sortPreferenceInput.addEventListener("change", async (event) => {
		setLocalStorage("sort_preference", event.target.value);
		const games = getLocalStorage("data");
		rowListing.renderGamesList(games, getLocalStorage("sort_preference"));
	});
}

fetchMoreTrigger.addEventListener("click", async () => {
	const newGames = await services.getGames("skip=20");
	const sortPreference = getLocalStorage("sort_preference");
	rowListing.renderGamesList(newGames, sortPreference, false);
	const cachedGames = getLocalStorage("data");
	cachedGames.push(...newGames);
	setLocalStorage("data", cachedGames);
});

init();
