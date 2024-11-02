import ExternalServices from "./ExternalServices.mjs";
import { formatDate, qsa, sortGames, getLocalStorage, setLocalStorage } from "./utils.mjs";

const services = new ExternalServices();

function getTruncatedNames(data) {
	const names = data.map((item) => item.name);

	if (names.length >= 3) {
		return `${names[0]}, ${names[1]}, and more`;
	} else {
		return names.join(", ");
	}
}

function getPlatforms(data) {
	return data.Platforms.map((item) => item.name).join(", ");
}

function getDevelopers(data) {
	const developers = data.Companies.filter((item) => item.type === "DEVELOPER");
	return developers.map((item) => item.name).join(","); // Join the names into a single string
}

function getPublishers(data) {
	const publishers = data.Companies.filter((item) => item.type === "PUBLISHER");
	return publishers.map((item) => item.name).join(","); // Join the names into a single string
}

function getGenres(data) {
	return data.Genres.map((item) => item.name).join(", ");
}

function createGameDetailsTemplate(gameId, gameDetails) {
	return `
		<tr class="game-details" data-details-target="${gameId}">
			<td colspan="5">
				<div class="details-wrapper">

					<div class="left-container">
						<p class="game__name">${gameDetails.name}</p>
					</div>
					<div class="middle-container">
						<p class="game__description">
						${gameDetails.description}
						</p>
						<h2>Available on: </h2>
						<p>${getPlatforms(gameDetails)}</p>
					</div>
					<div class="companies">
						<p>
							<strong>Developers: </strong> <span>${getDevelopers(gameDetails)}</span>
						</p>
						<p>
							<strong>Publishers: </strong> <span>${getPublishers(gameDetails)}</span>
						</p>
						<p>
							<strong>Genres: </strong> <span>${getGenres(gameDetails)}</span>
						</p>
						<button class="favourites-toggle call-to-action" data-gameId="${gameId}">Add to favourites <i class="fa-solid fa-heart"></i></button>
					</div>
				</div>
			</td>
		</tr>
	`;
}

function createFavouritesTemplate(gameId, gameDetails) {
	return `
    <div class="favourite-details-wrapper">
      <div class="left-container">
        <p class="game__name">${gameDetails.name}</p>
      </div>
      <div class="middle-container">
        <p class="game__description">
        ${gameDetails.description}
        </p>
        <h2>Available on: </h2>
        <p>${getPlatforms(gameDetails)}</p>
      </div>
      <div class="companies">
        <p>
          <strong>Developers: </strong> <span>${getDevelopers(gameDetails)}</span>
        </p>
        <p>
          <strong>Publishers: </strong> <span>${getPublishers(gameDetails)}</span>
        </p>
        <p>
          <strong>Genres: </strong> <span>${getGenres(gameDetails)}</span>
        </p>
				<button class="delete-favourite" data-gameId="${gameId}"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `;
}

function gameRowTemplate(game, index) {
	const rowClass = index % 2 === 0 ? "even" : "odd";
	return `
    <tr data-id="${game.id}" class="game-item ${rowClass}">
      <td
        colspan="1"
        rowspan="1"
        data-label="Name"
      >
        <a href="${game.url}">
        ${game.name}
        </a>
      </td>
      <td
        colspan="1"
        rowspan="1"
        data-label="Genres"
      >
        ${getTruncatedNames(game.Genres)}
      </td>
      <td
        colspan="1"
        rowspan="1"
        data-label="Release Date"
        class="game-release-date"
      >
        ${formatDate(game.firstReleaseDate)}
      </td>
      <td
        colspan="1"
        rowspan="1"
        data-label="Platforms"
        class="game-platforms"
      >
        ${getTruncatedNames(game.Platforms)}
      </td>
      <td
        colspan="1"
        rowspan="1"
        data-label="Recommendation (%)"
        class="game-recommendation-percentage"
      >
        ${game.percentRecommended.toFixed(2)}%
      </td>
    </tr>
  `;
}

async function handleClick(event) {
	event.stopPropagation(); // Stop the click event from bubbling up
	const clickedRow = event.currentTarget;
	const gameId = clickedRow.dataset.id; // Get the <tr> that was clicked
	const nextElementSibling = clickedRow.nextElementSibling; // Get the next element sibling
	if (nextElementSibling.classList.contains("game-details")) {
		nextElementSibling.classList.toggle("show");
		return;
	}

	try {
		const gameDetails = await services.getGameDetails(gameId);
		const gameDetailsTemplate = createGameDetailsTemplate(gameId, gameDetails);
		clickedRow.insertAdjacentHTML("afterend", gameDetailsTemplate);

		const newGamesDetailsRow = clickedRow.closest("tbody").querySelector(`[data-details-target="${gameId}"]`);

		const favouriteToggle = newGamesDetailsRow.querySelector(".favourites-toggle");
		let favourites = getLocalStorage("favourites") || [];
		if (favourites && favourites.find((item) => item === gameId)) {
			favouriteToggle.setAttribute("data-isFavourite", "true");
			return;
		}

		favouriteToggle.addEventListener("click", (event) => {
			event.stopPropagation();
			let favourites = getLocalStorage("favourites") || [];
			if (favourites && favourites.find((item) => item === gameId)) {
				favourites = favourites.filter((item) => item !== gameId);
				setLocalStorage("favourites", favourites);
				favouriteToggle.setAttribute("data-isFavourite", "false");
				return;
			}
			favourites.push(gameId);
			setLocalStorage("favourites", favourites);
			favouriteToggle.setAttribute("data-isFavourite", "true");
		});

		setTimeout(() => {
			newGamesDetailsRow.classList.toggle("show");
		}, 100); // This timeout is necessary as it gives the browser enough time to create the details element before handling the animation
		return;
	} catch (err) {
		const error = err;
		throw { name: "servicesError", message: error };
	}
}

export default class RowListing {
	constructor(listElement) {
		this.listElement = listElement;
	}

	async init() {
		const gameData = await services.getGames();
		setLocalStorage("data", gameData);
		const sortPreference = getLocalStorage("sort_preference") || "by-recommended";

		// render the list
		this.renderGamesList(gameData, sortPreference);
	}

	renderGamesList(list, sortPreference, clear = true) {
		const sortedList = sortGames(list, sortPreference);

		if (clear) {
			this.listElement.textContent = "";
		}

		sortedList.forEach((element, index) => {
			const templateString = gameRowTemplate(element, index);
			this.listElement.insertAdjacentHTML("beforeend", templateString);
		});
		const tableRows = qsa(".game-item");
		tableRows.forEach((tableRow) => {
			tableRow.addEventListener("click", handleClick);
		});
	}

	renderFavouritesList(parent, clear = true) {
		const favourites = getLocalStorage("favourites");

		if (clear) {
			parent.textContent = "";
		}

		if (!favourites || favourites.length === 0) {
			parent.innerHTML = `<p class="warning">You don't have any favourites for now</p>`;
			return;
		}

		favourites.forEach(async (gameId) => {
			const gameDetails = await services.getGameDetails(gameId);
			const templateString = createFavouritesTemplate(gameId, gameDetails);
			parent.insertAdjacentHTML("beforeend", templateString);
		});
	}
}
