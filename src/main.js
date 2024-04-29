import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";
import { room2 } from "./scenes/room2.js";

async function main() {
  const room1Data = await (await fetch("../maps/room1.json")).json();
  const room2Data = await (await fetch("../maps/room2.json")).json();

  k.scene("room1", () => room1(k, room1Data));
  k.scene("room2", () => room2(k, room2Data));

  k.go("room1");
}

main();
