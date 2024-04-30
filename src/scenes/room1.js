import { makeDrone } from "../entities/enemyDrone.js";
import { makePlayer } from "../entities/player.js";
import { state } from "../state/GlobalStateManager.js";
import { makeHealthBar } from "../ui/healthBar.js";
import {
  setMapColliders,
  setBackgroundColor,
  setCameraZones,
  setExitZones,
} from "./roomUtils.js";

export async function room1(k, roomData, previousSceneData) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(170, 100);
  k.setGravity(1000);

  const roomLayers = roomData.layers;

  const map = k.add([k.pos(0, 0), k.sprite("room1")]);
  const colliders = roomLayers[4].objects;

  setMapColliders(k, map, colliders);

  const player = map.add(makePlayer(k));

  k.onUpdate(() => {
    if (map.pos.x + 160 > player.pos.x) {
      k.camPos(map.pos.x + 160, k.camPos().y);
      return;
    }

    if (player.pos.x > map.pos.x + roomData.width * roomData.tilewidth - 160) {
      k.camPos(
        map.pos.x + roomData.width * roomData.tilewidth - 160,
        k.camPos().y
      );
      return;
    }
    k.camPos(player.pos.x, k.camPos().y);
  });

  const positions = roomLayers[5].objects;
  for (const position of positions) {
    if (position.name === "player" && !previousSceneData.exitName) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      continue;
    }

    if (
      position.name === "entrance-1" &&
      previousSceneData.exitName === "exit-1"
    ) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      k.camPos(player.pos);
      continue;
    }

    if (
      position.name === "entrance-2" &&
      previousSceneData.exitName === "exit-2"
    ) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      k.camPos(player.pos);
      continue;
    }

    if (position.type === "drone") {
      const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
      drone.setBehavior();
    }
  }

  const cameras = roomLayers[6].objects;

  setCameraZones(k, map, cameras);

  const exits = roomLayers[7].objects;
  setExitZones(k, map, exits, "room2");

  makeHealthBar(k);
}
