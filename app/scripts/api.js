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
