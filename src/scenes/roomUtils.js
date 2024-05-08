import { state, statePropsEnum } from "../state/GlobalStateManager.js";

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

    if (collider.name === "boss-barrier") {
      const bossBarrier = map.add([
        k.rect(collider.width, collider.height),
        k.color(k.Color.fromHex("#eacfba")),
        k.pos(collider.x, collider.y),
        k.area({
          collisionIgnore: ["collider"],
        }),
        k.opacity(0),
        "boss-barrier",
        {
          activate() {
            k.tween(
              this.opacity,
              0.3,
              1,
              (val) => (this.opacity = val),
              k.easings.linear
            );

            k.tween(
              k.camPos().x,
              collider.properties[0].value,
              1,
              (val) => k.camPos(val, k.camPos().y),
              k.easings.linear
            );
          },
          async deactivate(playerPosX) {
            k.tween(
              this.opacity,
              0,
              1,
              (val) => (this.opacity = val),
              k.easings.linear
            );
            await k.tween(
              k.camPos().x,
              playerPosX,
              1,
              (val) => k.camPos(val, k.camPos().y),
              k.easings.linear
            );
            k.destroy(this);
          },
        },
      ]);

      bossBarrier.onCollide("player", async (player) => {
        const currentState = state.current();
        if (currentState.isBossDefeated) {
          state.set(statePropsEnum.playerInBossFight, false);
          bossBarrier.deactivate(player.pos.x);
          return;
        }

        if (currentState.playerInBossFight) return;
        player.disableControls();
        player.play("idle");
        await k.tween(
          player.pos.x,
          player.pos.x + 25,
          0.2,
          (val) => (player.pos.x = val),
          k.easings.linear
        );
        player.setControls();
      });

      bossBarrier.onCollideEnd("player", () => {
        const currentState = state.current();
        if (currentState.playerInBossFight || currentState.isBossDefeated)
          return;

        state.set(statePropsEnum.playerInBossFight, true);

        bossBarrier.activate();
        bossBarrier.use(k.body({ isStatic: true }));
      });

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

export function setCameraControls(k, player, map, roomData) {
  k.onUpdate(() => {
    if (state.current().playerInBossFight) return;

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

      if (exit.name === "final-exit") {
        k.go("final-exit");
        return;
      }

      k.go(destinationName, { exitName: exit.name });
    });
  }
}
