// prettier-ignore
function sortByDate(orders) {
  return orders.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
}

function to2Dp(float) {
  return Number(float).toFixed(2);
}

function resize(_client, height) {
  _client.instance.resize({ height: height });
}

function formatOrder(order) {
  const { status, created_at, currency_code, deliver_to, total_price } = order;
  const { first_name, last_name, address1, zip, country } = deliver_to;

  return {
    name: first_name + " " + last_name,
    status: status,
    total: to2Dp(total_price) + " " + currency_code,
    address: address1 + ", " + zip + ", " + country,
    date: new Date(created_at).toLocaleDateString("en-GB"),
  };
}

function formatItems(items) {
  return $.map(items, function (item) {
    const { price_per_unit, quantity, sellable } = item;

    return {
      title: quantity + " x " + sellable.product_title,
      price: to2Dp(price_per_unit),
      sku: sellable.sku_code,
    };
  });
}
