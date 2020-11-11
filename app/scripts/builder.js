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

function buildNoOrders() {
  $("#orders-not-found").addClass("visible");
}

function buildOrder(order) {
  const { number, id, line_items } = order;

  var orderTmpl = $("#orderTemplate").tmpl(formatOrder(order));
  var itemsTmpls = $("#itemTemplate").tmpl(formatItems(line_items));

  updateHeader(number, id);
  updateIndicator(state.currentIndex);

  $("#order-container").empty().append(orderTmpl);
  $("#items").append(itemsTmpls);
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
    .removeClass("selected")
    .eq(idx)
    .addClass("selected");
}
