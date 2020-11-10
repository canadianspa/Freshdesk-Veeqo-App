function onAppActivated() {
  fetchOrders().then(
    function (orders) {
      removeSpinner();

      if (orders.length === 0) {
        buildNoOrders();
      } else {
        resize(client, "300px");
        state.orders = sortByDate(orders);

        buildNavigation(state.orders);
        buildOrder(state.orders[state.currentIndex]);
      }
    },
    function (error) {
      console.error(error);
    }
  );
}

function handleNavigation(direction) {
  var idx = state.currentIndex + direction;
  if (idx >= 0 && idx < state.orders.length) {
    state.currentIndex = idx;
    buildOrder(state.orders[idx]);
  }
}

function loadTemplate(name) {
  $.get(`./templates/${name}.html`, function (template) {
    state.templates[name] = $.parseHTML(template);
  });
}

function addEventListeners() {
  $("#button-right").click(function () {
    handleNavigation(1);
  });

  $("#button-left").click(function () {
    handleNavigation(-1);
  });
}

function onDocumentReady() {
  app.initialized().then(
    (_client) => {
      resize(_client, "100px");
      addEventListeners();

      window.client = _client;
      window.state = {};

      state.currentIndex = 0;
      state.templates = {};

      loadTemplate("order");
      loadTemplate("item");

      _client.events.on("app.activated", onAppActivated);
    },
    function (error) {
      console.error(error);
    }
  );
}

$(document).ready(onDocumentReady);
