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
      var wrapper = $(".fw-widget-wrapper");
      wrapper.empty();

      if (orders.length > 0) {
        resizeClient("250px");
        orders = sortByDate(orders);

        $.map(orders, function (order) {
          HTMLOrderBuilder(order, wrapper);
        });

        addMenuListener();
      } else {
        HTMLNoOrderBuilder(wrapper);
      }
    },
    function (error) {
      console.error(error);
    }
  );
}

function addMenuListener() {
  $(".arrow").click(function () {
    var order = $(this).parent().parent();
    var arrow = $(this);
    var items = order.find(".expandable-menu");

    if (items.hasClass("open")) {
      items.removeClass("open");
      arrow.toggleClass("fa-angle-up fa-angle-down");
    } else {
      $(".expandable-menu").removeClass("open");
      $(".arrow").removeClass("fa-angle-up");
      $(".arrow").addClass("fa-angle-down");

      items.addClass("open");
      arrow.toggleClass("fa-angle-up fa-angle-down");

      order[0].scrollIntoView(true);
    }
  });
}

function sortByDate(orders) {
  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function resizeClient(height) {
  client.instance.resize({ height: height });
}

function onDocumentReady() {
  app.initialized().then((_client) => {
    window.client = _client;

    resizeClient("100px");
    _client.events.on("app.activated", onAppActivated);
  });
}

$(document).ready(onDocumentReady);
