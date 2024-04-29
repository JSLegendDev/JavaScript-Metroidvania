import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";
import { room2 } from "./scenes/room2.js";

async function main() {
  const room1Data = await (await fetch("../maps/room1.json")).json();
  const room2Data = await (await fetch("../maps/room2.json")).json();

  k.scene("room1", (previousSceneData) =>
    room1(k, room1Data, previousSceneData)
  );
  k.scene("room2", (previousSceneData) =>
    room2(k, room2Data, previousSceneData)
  );

  k.go("room1");
}

main();
