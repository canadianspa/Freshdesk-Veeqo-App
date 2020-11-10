const VEEQO_APP_URL = "https://app.veeqo.com/orders";
const VEEQO_API_URL = "https://api.veeqo.com/orders";
const VEEQO_APIKEY = "<%= iparam.apiKey %>";

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

function onAppActivated() {
  fetchOrders().then(
    function (orders) {
      $(".spinner").remove();

      if (orders.length > 0) {
        $("#router").css("display", "block");

        client.instance.resize({ height: "300px" });

        state.orders = sortByDate(orders);
        var order = state.orders[state.currentIndex];

        var indicator = $(".indicator");
        for (const order in state.orders) {
          $("<div/>").appendTo(indicator);
        }

        buildOrder(order);
        addEventListeners();
      } else {
        buildNoOrders();
      }
    },
    function (error) {
      console.error(error);
    }
  );
}

function addEventListeners() {
  arrowClickListener();
}

function arrowClickListener() {
  $(".fa").click(function () {
    var i = $(this).hasClass("fa-angle-left")
      ? state.currentIndex - 1
      : state.currentIndex + 1;

    if (i >= 0 && i < state.orders.length) {
      state.currentIndex = i;
      buildOrder(state.orders[i]);
    }
  });
}

function sortByDate(orders) {
  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function onDocumentReady() {
  app.initialized().then((_client) => {
    window.client = _client;

    window.state = {};
    state.currentIndex = 0;

    _client.instance.resize({ height: "100px" });
    _client.events.on("app.activated", onAppActivated);
  });
}

$(document).ready(onDocumentReady);
