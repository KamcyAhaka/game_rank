// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
	return parent.querySelector(selector);
}
// wrapper for querySelectorAll...returns matching element
export function qsa(selector, parent = document) {
	return parent.querySelectorAll(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

export function formDataToJSON(formInputs) {
	const convertedJSON = {};

	formInputs.forEach((input) => {
		convertedJSON[input.id] = input.value;
	});

	return convertedJSON;
}

// retrieve data from localstorage
export function getLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
	qs(selector).addEventListener("touchend", (event) => {
		event.preventDefault();
		callback(event);
	});
	qs(selector).addEventListener("click", callback);
}

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

export function formatDate(dateString) {
	const date = new Date(dateString);

	// Extract day, month, and year
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
}

export function getInitials(name) {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("");
}
