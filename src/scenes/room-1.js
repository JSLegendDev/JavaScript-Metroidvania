import { drawLayer } from "../utils/drawingUtils.js";
import { makePlayer } from "../entities/player.js";

export async function room1(k) {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#a2aed5")),
    k.fixed(),
  ]);

  k.camScale(4);
  k.camPos(170, 270);
  k.setGravity(3000);

  const roomData = await (await fetch("../maps/room1.json")).json();
  const roomLayers = roomData.layers;

  const map = k.add([k.pos(0, k.center().y - 200)]);
  const colliders = roomLayers[4].objects;

  for (const collider of colliders) {
    const polygonPoints = [];
    for (const { x, y } of collider.polygon) {
      polygonPoints.push(k.vec2(x, y));
    }
    map.add([
      k.pos(collider.x, collider.y + 16),
      k.area({ shape: new k.Polygon(polygonPoints) }),
      k.body({ isStatic: true }),
    ]);
  }

  k.onDraw(() => {
    for (const layer of roomLayers) {
      if (layer.type === "objectgroup") continue;

      if (
        layer.type === "tilelayer" &&
        (layer.name === "platforms" || layer.name === "props")
      ) {
        drawLayer(k, layer, map.pos, "tileset", 16);
        continue;
      }

      if (
        layer.type === "tilelayer" &&
        (layer.name === "background" || layer.name === "background-2")
      ) {
        drawLayer(k, layer, map.pos, "background", 16, 693);
      }
      continue;
    }
  });

  const player = k.add(makePlayer(k));
  const positions = roomLayers[5].objects;
  for (const position of positions) {
    if (position.name === "player") {
      player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
      player.setControls();
      continue;
    }
  }

  const cameras = roomLayers[6].objects;
  for (const camera of cameras) {
    const cameraObj = map.add([
      k.area({ shape: new k.Rect(k.vec2(0), camera.width, camera.height) }),
      k.pos(camera.x, camera.y),
    ]);

    cameraObj.onCollide("player", () => {
      k.camPos(camera.properties[0].value, camera.properties[1].value);
    });
  }
}
