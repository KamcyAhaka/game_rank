// wrapper for querySelectorAll...returns matching element
export function qsa(selector, parent = document) {
	return parent.querySelectorAll(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

// sort games list by preference
export function sortGames(games, sortPreference) {
	let sortedGames = [];

	if (sortPreference === "by-recommended") {
		sortedGames = games.sort((a, b) => b.percentRecommended - a.percentRecommended);
	} else if (sortPreference === "by-release-date") {
		sortedGames = games.sort((a, b) => new Date(b.firstReleaseDate) - new Date(a.firstReleaseDate));
	} else if (sortPreference === "by-name") {
		sortedGames = games.sort((a, b) => a.name.localeCompare(b.name));
	} else {
		// Default sort: by-recommended, if no valid preference is provided
		sortedGames = games.sort((a, b) => b.percentRecommended - a.percentRecommended);
	}

	return sortedGames;
}

// utility function for formating dates
export function formatDate(dateString) {
	const date = new Date(dateString);

	// Extract day, month, and year
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}
