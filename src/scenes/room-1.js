import { makePlayer } from "../entities/player.js";

export async function room1(k) {
  k.setBackground("#a2aed5");
  k.camScale(4);
  k.setGravity(2600);

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
        const currentTilePos = k.vec2(map.pos);
        let nbTilesDrawn = 0;
        for (const tile of layer.data) {
          if (nbTilesDrawn % layer.width === 0) {
            currentTilePos.x = 0;
            currentTilePos.y += 16;
          } else {
            currentTilePos.x += 16;
          }

          nbTilesDrawn++;
          if (tile === 0) continue;

          k.drawSprite({
            sprite: "tileset",
            frame: tile - 1,
            pos: currentTilePos,
          });
        }
        continue;
      }

      if (
        layer.type === "tilelayer" &&
        (layer.name === "background" || layer.name === "background-2")
      ) {
        const currentTilePos = k.vec2(map.pos);
        let nbTilesDrawn = 0;
        for (const tile of layer.data) {
          if (nbTilesDrawn % layer.width === 0) {
            currentTilePos.x = 0;
            currentTilePos.y += 16;
          } else {
            currentTilePos.x += 16;
          }

          nbTilesDrawn++;
          if (tile === 0) continue;

          k.drawSprite({
            sprite: "background",
            frame: tile - 693,
            pos: currentTilePos,
          });
        }
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

  k.onUpdate(() => {
    //k.camPos(k.center());
    k.camPos(player.pos.x, 400);
  });
}
