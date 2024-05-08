import { makeBoss } from "../entities/enemyBoss.js";
import { makeDrone } from "../entities/enemyDrone.js";
import { makePlayer } from "../entities/player.js";
import { state } from "../state/GlobalStateManager.js";
import { healthBar } from "../ui/healthBar.js";

import {
  setMapColliders,
  setBackgroundColor,
  setCameraControls,
  setCameraZones,
  setExitZones,
} from "./roomUtils.js";

export async function room1(
  k,
  roomData,
  previousSceneData = { exitName: null }
) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(170, 100);
  k.setGravity(1000);

  const roomLayers = roomData.layers;

  const map = k.add([k.pos(0, 0), k.sprite("room1")]);
  const colliders = roomLayers[4].objects;

  setMapColliders(k, map, colliders);

  const player = map.add(makePlayer(k));

  setCameraControls(k, player, map, roomData);

  const positions = roomLayers[5].objects;
  for (const position of positions) {
    if (position.name === "player" && !previousSceneData.exitName) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
      continue;
    }

    if (
      position.name === "entrance-1" &&
      previousSceneData.exitName === "exit-1"
    ) {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
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
      player.setEvents();
      k.camPos(player.pos);
      continue;
    }

    if (position.type === "drone") {
      const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
      drone.setBehavior();
      drone.setEvents();
      continue;
    }

    if (position.name === "boss" && !state.current().isBossDefeated) {
      const boss = map.add(makeBoss(k, k.vec2(position.x, position.y)));
      boss.setBehavior();
      boss.setEvents();
    }
  }

  const cameras = roomLayers[6].objects;

  setCameraZones(k, map, cameras);

  const exits = roomLayers[7].objects;
  setExitZones(k, map, exits, "room2");

  healthBar.setEvents();
  healthBar.trigger("update");
  k.add(healthBar);
}
