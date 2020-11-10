function removeSpinner() {
  $(".spinner").remove();
}

function buildNavigation(orders) {
  $("#nav-container").addClass("visible");

  $("#indicator").append(
    $.map(orders, function () {
      return $("<div/>");
    })
  );
}

// prettier-ignore
function buildNoOrders() {
  $("#order-container")
    .addClass("muted")
    .addClass("centre")
    .text("No orders found");
}

function buildOrder(order) {
  const { number, id, line_items } = order;

  updateHeader(number, id);
  updateIndicator(state.currentIndex);

  var orderTmpl = $(state.templates.order).tmpl(formatOrder(order));
  var itemsTmpls = $(state.templates.item).tmpl(formatItems(line_items));

  var container = $("#order-container");
  container.empty();
  container.append(orderTmpl);

  var items = $("#items");
  items.append(itemsTmpls);
}

function updateHeader(text, id) {
  $("#header")
    .text(text)
    .attr("target", "_blank")
    .attr("href", `${VEEQO_APP_URL}/${id}`);
}

function updateIndicator(idx) {
  $("#indicator")
    .children()
    .removeClass("selected-indicator")
    .eq(idx)
    .addClass("selected-indicator");
}
