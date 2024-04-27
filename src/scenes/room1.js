import { makePlayer } from "../entities/player.js";

export async function room1(k) {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#a2aed5")),
    k.fixed(),
  ]);

  k.camScale(4);
  k.camPos(170, 270);
  k.setGravity(1000);

  const roomData = await (await fetch("../maps/room1.json")).json();
  const roomLayers = roomData.layers;

  const map = k.add([k.pos(0, k.center().y - 200), k.sprite("room1")]);
  const colliders = roomLayers[4].objects;

  for (const collider of colliders) {
    const polygonPoints = [];
    for (const { x, y } of collider.polygon) {
      polygonPoints.push(k.vec2(x, y));
    }
    map.add([
      k.pos(collider.x, collider.y),
      k.area({ shape: new k.Polygon(polygonPoints) }),
      k.body({ isStatic: true }),
    ]);
  }

  const player = k.add(makePlayer(k));

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
      k.pos(camera.x, camera.y + 16),
    ]);

    cameraObj.onCollide("player", () => {
      if (k.camPos().x !== camera.properties[0].value) {
        k.tween(
          k.camPos().y,
          camera.properties[0].value,
          0.8,
          (val) => k.camPos(k.camPos().x, val),
          k.easings.linear
        );

        //k.camPos(k.camPos().x, camera.properties[0].value);
      }
    });
  }
}
