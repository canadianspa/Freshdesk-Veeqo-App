function buildNoOrders() {
  $("#container").addClass("muted centre").text("No orders found");
}

function buildOrder(order) {
  var container = $("#container");
  container.empty();

  const {
    id,
    number,
    status,
    created_at,
    currency_code,
    deliver_to,
    total_price,
    line_items,
  } = order;

  updateHeader(number, id);

  var orderData = {
    name: `${deliver_to.first_name} ${deliver_to.last_name}`,
    status: status,
    total: `${to2Dp(total_price)} ${currency_code}`,
    post: "This is the contents of my post",
    address: `${deliver_to.address1}, ${deliver_to.zip}, ${deliver_to.country}`,
    date: moment(created_at).format("DD/MM/YYYY"),
  };

  container.loadTemplate($("#orderTemplate"), orderData);

  $.map(line_items, function (item) {
    var itemData = {
      title: `${item.quantity} x ${item.sellable.product_title}`,
      price: `${to2Dp(item.price_per_unit)}`,
      sku: item.sellable.sku_code,
    };

    $("#items").loadTemplate($("#itemTemplate"), itemData, { append: true });
  });
}

function updateHeader(text, id) {
  $("#header")
    .text(text)
    .attr("target", "_blank")
    .attr("href", `${VEEQO_APP_URL}/${id}`);
}

function to2Dp(float) {
  return Number(float).toFixed(2);
}
