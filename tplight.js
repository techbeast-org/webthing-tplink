const TPLSmartDevice = require("tplink-lightbulb");

const light = new TPLSmartDevice("IP-ADDRESS-OF-YOUR-BULB");
// light
//   .power(true)
//   .then((status) => {
//     console.log(status);
//   })
//   .catch((err) => console.error(err));
light.power(false).then((response) => {
  console.log(response);
});
