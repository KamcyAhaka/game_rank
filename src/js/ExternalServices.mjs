const apiKey = import.meta.env.VITE_RAPID_API_KEY;

export default class ExternalServices {
	async getGames(params = undefined) {
		const baseURL = import.meta.env.VITE_OPEN_CRITIC_API_BASEURL;

		const options = {
			method: "GET",
			headers: {
				"x-rapidapi-key": apiKey,
				"x-rapidapi-host": import.meta.env.VITE_OPEN_CRITIC_API_HOST,
			},
		};

		try {
			const url = params ? `${baseURL}game?${params}` : `${baseURL}game`;

			const response = await fetch(url, options);
			const data = await response.json();

			return data;
		} catch (err) {
			const error = err;
			throw { name: "servicesError", message: error };
		}
	}
	async getGameDetails(id) {
		const baseURL = import.meta.env.VITE_OPEN_CRITIC_API_BASEURL;

		const options = {
			method: "GET",
			headers: {
				"x-rapidapi-key": apiKey,
				"x-rapidapi-host": import.meta.env.VITE_OPEN_CRITIC_API_HOST,
			},
		};

		try {
			const response = await fetch(`${baseURL}game/${id}`, options);
			const data = await response.json();

			return data;
		} catch (err) {
			const error = err;
			throw { name: "servicesError", message: error };
		}
	}
}