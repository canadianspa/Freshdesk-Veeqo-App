$(document).ready(() => {
	app.initialized().then((_client) => {
		var client = _client;

		client.events.on("app.activated", onAppActivated(client));
	});
});

const VEEQO_APP_URL = "https://app.veeqo.com/orders";
const VEEQO_API_URL = "https://api.veeqo.com/orders";

function onAppActivated(client) {
	client.data
		.get("contact")
		.then((data) => {
			getOrders(client, data.contact.email).then((orders) => {
				$("#wrapper").empty();
				console.log(orders);

				orders.forEach((order) => {
					let html = `<a class="order" target="_blank" href="${VEEQO_APP_URL}/${order.id}">#P-${order.id}</a>`;
					$("#wrapper").append(html);
				});
			});
		})
		.catch((e) => console.log("Exception - ", e));
}

async function getOrders(client, email) {
	// USE IPARAMS <%= iparam.apiKey %>
	var VEEQO_APIKEY = "xxxx";

	var url = `${VEEQO_API_URL}?query=${email}`;

	var options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": VEEQO_APIKEY,
		},
	};

	return await client.request.get(url, options).then(
		(data) => JSON.parse(data.response),
		(e) => console.log("Bad response - ", e)
	);
}
