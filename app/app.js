$(document).ready(() => {
	app.initialized().then((_client) => {
		var client = _client;

		client.instance.resize({ height: "100px" });
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
				var wrapper = $("#wrapper");
				wrapper.empty();

				if (orders.length === 0) {
					var html = `No orders found`;
					wrapper.append(html);
				} else {
					client.instance.resize({ height: "300px" });

					orders = orders.sort(
						(a, b) =>
							new Date(b.created_at) - new Date(a.created_at)
					);

					orders.forEach((order) => {
						var html = HTMLBuilder(order);
						wrapper.append(html);
					});

					addMenuHandler();
				}
			});
		})
		.catch((e) => console.log("Exception - ", e));
}

function HTMLBuilder(order, itemsHTML) {
	date = new Date(order.created_at);
	day = date.getDate();
	month = date.getMonth() + 1;
	year = date.getFullYear();

	var itemsHTML = order.line_items
		.map(
			(item) => `
				<div>${item.sellable.sku_code}</div>
				<div>${item.quantity}</div>
			`
		)
		.join("");

	return `
		<div class="order">
			<span class="order-header common-border ${
				order.status === "cancelled" && "cancelled"
			}">
				<a target="_blank" href="${VEEQO_APP_URL}/${order.id}">#P-${order.id}</a>
				<span>${day + "/" + month + "/" + year}</span>
				<i class="fa fa-angle-down arrow" style="font-size:24px"></i>
			</span>
			<div class="expandable-menu common-border">
				<span>Name</span>
				<span></span>
				<div>
					${order.deliver_to.first_name + " " + order.deliver_to.last_name}
				</div>
				<div>
				</div>
				<span>Address 1</span>
				<span>Postcode</span>
				<div>
					${order.deliver_to.address1}
				</div>
				<div>
					${order.deliver_to.zip}
				</div>
				<span>Item</span>
				<span>Quantity</span>
				${itemsHTML}
			</div>
		</div>
	`;
}

function addMenuHandler() {
	$(".arrow").click(function () {
		var items = $(this).parent().next();
		var arrow = $(this);
		if (items.hasClass("open")) {
			items.removeClass("open");
			arrow.toggleClass("fa-angle-up fa-angle-down");
		} else {
			$(".expandable-menu").removeClass("open");
			$(".arrow").removeClass("fa-angle-up");
			$(".arrow").addClass("fa-angle-down");

			items.addClass("open");
			arrow.toggleClass("fa-angle-up fa-angle-down");
			items.parent()[0].scrollIntoView(true);
		}
	});
}

async function getOrders(client, email) {
	// USE IPARAMS <%= iparam.apiKey %>
	var VEEQO_APIKEY = "xxx";

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
