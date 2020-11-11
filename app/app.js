function handleOrders(orders) {
  state.orders = orders;

  if (orders.length > 0) {
    resize(client, "300px");

    buildNavigation(orders);
    buildOrder(orders[state.currentIndex]);
  } else {
    buildNoOrders();
  }
}

function handleNavigation(direction) {
  var i = state.currentIndex + direction;
  if (i >= 0 && i < state.orders.length) {
    state.currentIndex = i;
    buildOrder(state.orders[i]);
  }
}

function addEventListeners() {
  $("#button-right").click(function () {
    handleNavigation(1);
  });

  $("#button-left").click(function () {
    handleNavigation(-1);
  });
}

function onAppActivated() {
  // Disable re-rendering when open/closed
  if (state.orders === undefined) {
    fetchOrders().then(
      function (orders) {
        orders = sortByDate(orders);
        removeSpinner();

        handleOrders(orders);
      },
      function (error) {
        console.error(error);
      }
    );
  }
}

function onDocumentReady() {
  app.initialized().then(
    function (_client) {
      resize(_client, "80px");
      addEventListeners();

      window.client = _client;
      window.state = {};
      state.currentIndex = 0;

      _client.events.on("app.activated", onAppActivated);
    },
    function (error) {
      console.error(error);
    }
  );
}

$(document).ready(onDocumentReady);
