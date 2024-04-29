import { setBackgroundColor, setMapColliders } from "./roomUtils.js";

export function room2(k, roomData, previousSceneData) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(170, 100);
  k.setGravity(1000);

  const roomLayers = roomData.layers;
  const map = k.add([k.pos(0, 0), k.sprite("room2")]);

  console.log(previousSceneData);
  const colliders = roomLayers[4].objects;
  setMapColliders(k, map, colliders);

  const player = k.add(makePlayer(k));
}
