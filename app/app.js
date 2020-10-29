$(document).ready(() => {
	app.initialized().then((_client) => {
		var client = _client;
		//client.instance.resize({ height: "400px" });

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
				// Remove spinner
				$("#wrapper").empty();

				orders = orders.sort(
					(a, b) => new Date(b.created_at) - new Date(a.created_at)
				);

				orders.forEach((order) => {
					date = new Date(order.created_at);
					year = date.getFullYear();
					month = date.getMonth() + 1;
					dt = date.getDate();

					let itemsHTML = "";
					order.line_items.forEach(
						(item) =>
							(itemsHTML += `
								<div>${item.sellable.product_title}</div>
								<div>${item.quantity}</div>
						`)
					);

					let html = `
						<div class="order">
							<span>
								<a target="_blank" href="${VEEQO_APP_URL}/${order.id}">#P-${order.id}</a>
								<span>${dt + "/" + month + "/" + year}</span>
								<i class="fa fa-angle-down arrow" style="font-size:24px"></i>
							</span>
							<div class="items">
								<span>Item</span>
								<span>Quantity</span>
								${itemsHTML}
							</div>
						</div
					`;
					$("#wrapper").append(html);
				});

				$(".arrow").click(function () {
					var arrow = $(this);
					var items = $(this).parent().next();
					if (items.hasClass("open")) {
						items.removeClass("open");
						arrow.removeClass("fa-angle-up");
						arrow.addClass("fa-angle-down");
					} else {
						$(".items").removeClass("open");
						$(".arrow").removeClass("fa-angle-up");
						$(".arrow").addClass("fa-angle-down");
						items.addClass("open");
						arrow.removeClass("fa-angle-down");
						arrow.addClass("fa-angle-up");
						items.parent()[0].scrollIntoView(true);
					}
				});
			});
		})
		.catch((e) => console.log("Exception - ", e));
}

async function getOrders(client, email) {
	// USE IPARAMS <%= iparam.apiKey %>
	var VEEQO_APIKEY = "856db8e4037797f28c63d21a5359781a";

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
