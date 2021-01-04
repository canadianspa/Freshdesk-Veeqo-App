function removeSpinner() {
  $(".spinner").hide();
}

function removeError() {
  $(".error").remove();
  $(".spinner").show();
}

// prettier-ignore
function buildError() {
  var wrapper = $(".fw-widget-wrapper")
  $("<div/>")
    .addClass("muted error")
    .text(errorMsg)
    .appendTo(wrapper)
}

function buildNavigation(orders) {
  $("#nav-container").show();
  $("#indicator").append(
    $.map(orders, function () {
      return $("<div/>");
    })
  );
}

function buildNoOrders() {
  var container = $("#order-container");
  $("<div/>")
    .addClass("muted")
    .addClass("centre")
    .text(noOrdersMsg)
    .appendTo(container);
}

function buildOrder(order) {
  const { number, id, line_items } = order;

  if (line_items.length === 1) {
    resizeContainer(260);
  } else if (line_items.length === 2) {
    resizeContainer(295);
  } else {
    resizeContainer(325);
  }

  var orderTmpl = $("#orderTemplate").tmpl(formatOrder(order));
  var itemsTmpls = $("#itemTemplate").tmpl(formatItems(line_items));

  updateHeader(number, id);
  updateIndicator(state.currentIndex);

  $("#order-container").empty().append(orderTmpl);
  $("#items").append(itemsTmpls);
}

function resizeContainer(size) {
  $("#order-container").css("max-height", size - 32 + "px");
  resize(client, size + "px");
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
