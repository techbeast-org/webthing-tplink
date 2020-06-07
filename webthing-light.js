// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0
const {
  Property,
  SingleThing,
  Thing,
  Value,
  WebThingServer,
} = require("webthing");
const TPLSmartDevice = require("tplink-lightbulb");
const light = new TPLSmartDevice("IP-ADDRESS-OF-YOUR-BULB");

const { v4: uuidv4 } = require("uuid");

function makeThing() {
  const thing = new Thing(
    "urn:dev:ops:my-lamp-1234",
    "My Smart lamp",
    ["OnOffSwitch", "Light"],
    "A web connected lamp"
  );

  thing.addProperty(
    new Property(
      thing,
      "on",
      new Value(
        true,
        (v) => light.power(v) & console.log("plug state is now", v)
      ),
      {
        "@type": "OnOffProperty",
        title: "On/Off",
        type: "boolean",
        description: "Whether the lamp is turned on",
      }
    )
  );
  thing.addProperty(
    new Property(
      thing,
      "brightness",
      new Value(
        0,
        (v) =>
          light.send({
            "smartlife.iot.smartbulb.lightingservice": {
              transition_light_state: {
                on_off: 1,
                brightness: v,
              },
            },
          }) & console.log("Brightness is now", v)
      ),
      {
        "@type": "BrightnessProperty",
        title: "Brightness",
        type: "integer",
        description: "The level of light from 0-100",
        minimum: 0,
        maximum: 100,
        unit: "percent",
      }
    )
  );

  return thing;
}

function runServer() {
  const thing = makeThing();

  // If adding more than one thing, use MultipleThings() with a name.
  // In the single thing case, the thing's name will be broadcast.
  const server = new WebThingServer(new SingleThing(thing), 8888);

  process.on("SIGINT", () => {
    server
      .stop()
      .then(() => process.exit())
      .catch(() => process.exit());
  });

  server.start().catch(console.error);
}

runServer();
