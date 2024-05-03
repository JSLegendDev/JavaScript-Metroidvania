export function setBackgroundColor(k, hexColorCode) {
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex(hexColorCode)),
    k.fixed(),
  ]);
}

export function setMapColliders(k, map, colliders) {
  for (const collider of colliders) {
    if (collider.polygon) {
      const coordinates = [];
      for (const point of collider.polygon) {
        coordinates.push(k.vec2(point.x, point.y));
      }

      map.add([
        k.pos(collider.x, collider.y),
        k.area({
          shape: new k.Polygon(coordinates),
          collisionIgnore: ["collider"],
        }),
        k.body({ isStatic: true }),
        "collider",
        collider.type,
      ]);
      continue;
    }
    map.add([
      k.pos(collider.x, collider.y),
      k.area({
        shape: new k.Rect(k.vec2(0), collider.width, collider.height),
        collisionIgnore: ["collider"],
      }),
      k.body({ isStatic: true }),
      "collider",
      collider.type,
    ]);
  }
}

export function setCameraZones(k, map, cameras) {
  for (const camera of cameras) {
    const cameraZone = map.add([
      k.area({
        shape: new k.Rect(k.vec2(0), camera.width, camera.height),
        collisionIgnore: ["collider"],
      }),
      k.pos(camera.x, camera.y),
    ]);

    cameraZone.onCollide("player", () => {
      if (k.camPos().x !== camera.properties[0].value) {
        k.tween(
          k.camPos().y,
          camera.properties[0].value,
          0.8,
          (val) => k.camPos(k.camPos().x, val),
          k.easings.linear
        );
      }
    });
  }
}

export function setExitZones(k, map, exits, destinationName) {
  for (const exit of exits) {
    const exitZone = map.add([
      k.pos(exit.x, exit.y),
      k.area({
        shape: new k.Rect(k.vec2(0), exit.width, exit.height),
        collisionIgnore: ["collider"],
      }),
      k.body({ isStatic: true }),
      exit.name,
    ]);

    exitZone.onCollide("player", async () => {
      const background = k.add([
        k.pos(-k.width(), 0),
        k.rect(k.width(), k.height()),
        k.color("#20214a"),
      ]);

      await k.tween(
        background.pos.x,
        0,
        0.3,
        (val) => (background.pos.x = val),
        k.easings.linear
      );

      k.go(destinationName, { exitName: exit.name });
    });
  }
}
