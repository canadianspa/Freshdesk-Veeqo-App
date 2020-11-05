const VEEQO_APP_URL = "https://app.veeqo.com/orders";
const VEEQO_API_URL = "https://api.veeqo.com/orders";
const VEEQO_APIKEY = "856db8e4037797f28c63d21a5359781a";
//const VEEQO_APIKEY = "<%= iparam.apiKey %>";

function onAppActivated() {
	fetchOrders().then(
		function (orders) {
			var wrapper = $("#wrapper");
			wrapper.empty();

			if (orders.length === 0) {
				$("<div/>")
					.addClass("no-orders")
					.text("No orders found.")
					.appendTo(wrapper);
			} else {
				client.instance.resize({ height: "300px" });

				orders = orders.sort(
					(a, b) => new Date(b.created_at) - new Date(a.created_at)
				);

				orders.forEach((order) => {
					var html = HTMLBuilder(order);
					wrapper.append(html);
				});

				addMenuListener();
			}
		},
		function (error) {
			console.error(error);
			notifyError("Error fetching orders");
		}
	);
}

function HTMLBuilder(orders) {
	var date = new Date(order.created_at);
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	var ordersHtml = orders.map((order) => {
		var itemsHTML = order.line_items
			.map((item) => $("<div/>").text(item.sellable.product_title))
			.join("");
	});

	$.each(contactNames, function (i) {
		var li = $("<li/>")
			.addClass("list-group-item")
			.attr("role", "menuitem")
			.appendTo(contactsList);
		$("<div/>").text(contactNames[i]).appendTo(li);
		$("<div/>")
			.text(contactPhones[i])
			.addClass("contactPhone")
			.appendTo(li);
	});

	return `
		<div class="order">
			<span class="order-header common-border ${
				order.status === "cancelled" && "cancelled"
			}">
				<a target="_blank" href="${VEEQO_APP_URL}/${order.id}">#P-${order.id}</a>
				<span>${day + "/" + month + "/" + year}</span>
				<i class="fa fa-angle-down arrow" style="font-size:24px"></i>
			</span>
			<div class="fw-content-list expandable-menu common-border">
				<div class="muted">Address</div>
				<div>
					${order.deliver_to.first_name + " " + order.deliver_to.last_name}
					<br/>
					${order.deliver_to.address1}
					<br/>
					${order.deliver_to.zip}
				</div>
				<div class="muted">Item</div>
				${itemsHTML}
			</div>
		</div>
	`;
}

function addMenuListener() {
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

function notifyError(message) {
	client.interface.trigger("showNotify", {
		type: "alert",
		message: message,
	});
}

function fetchOrders() {
	return new Promise(function (resolve, reject) {
		client.data.get("contact").then(
			function (data) {
				const url = `${VEEQO_API_URL}?query=${data.contact.email}`;

				var options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": VEEQO_APIKEY,
					},
				};

				client.request.get(url, options).then(
					function (data) {
						return resolve(JSON.parse(data.response));
					},
					function (error) {
						console.error(error);
						return reject(error);
					}
				);
			},
			function (error) {
				console.error(error);
				return reject(error);
			}
		);
	});
}

function onDocumentReady() {
	app.initialized().then((_client) => {
		window.client = _client;

		client.instance.resize({ height: "100px" });
		client.events.on("app.activated", onAppActivated);
	});
}

$(document).ready(onDocumentReady);
