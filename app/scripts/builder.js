function HTMLNoOrderBuilder(wrapper) {
	$("<div/>")
		.addClass("muted")
		.addClass("no-orders")
		.text("No orders found")
		.appendTo(wrapper);
}

function HTMLOrderBuilder(order, wrapper) {
	// prettier-ignore
	const { 
        first_name,
        last_name,
        address1, 
        zip 
    } = order.deliver_to;

	var div = $("<div/>").addClass("order");

	buildHeader(order, div);

	var menu = $("<div/>").addClass("fw-content-list expandable-menu");

	buildMenuItem("Name", `${first_name} ${last_name}`, menu);
	buildMenuItem("Address", `${address1}, ${zip}`, menu);

	$.map(order.line_items, function (item, index) {
		buildMenuItem(
			index === 0 && "Items",
			item.sellable.product_title,
			menu
		);
	});

	menu.appendTo(div);
	div.appendTo(wrapper);
}

function buildHeader(order, parent) {
	const { id, created_at } = order;

	var header = $("<span/>");

	$("<a/>")
		.text(`#P-${id}`)
		.attr("target", "_blank")
		.attr("href", `${VEEQO_APP_URL}/${id}`)
		.appendTo(header);

	var datestring = moment(created_at).format("DD/MM/YYYY");

	// prettier-ignore
	$("<span/>")
        .text(datestring)
        .appendTo(header);

	$("<i/>")
		.addClass("fa fa-angle-down")
		.addClass("arrow")
		.attr("style", "font-size:24px")
		.appendTo(header);

	header.appendTo(parent);
}

function buildMenuItem(header, text, parent) {
	if (header) {
		// prettier-ignore
		$("<div/>")
            .addClass("muted")
            .text(header)
            .appendTo(parent);
	}

	// prettier-ignore
	$("<div/>")
        .text(text)
        .appendTo(parent);
}
