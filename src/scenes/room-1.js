import { makePlayer } from "../entities/player.js";

export async function room1(k) {
  k.setBackground("#a2aed5");
  k.camScale(4);
  k.setGravity(2600);

  const roomData = await (await fetch("../maps/room1.json")).json();
  const roomLayers = roomData.layers;
  const roomOrigin = k.vec2(0, k.center().y - 200);

  k.onDraw(() => {
    for (const layer of roomLayers) {
      if (
        layer.type === "tilelayer" &&
        (layer.name === "platforms" || layer.name === "props")
      ) {
        const currentTilePos = k.vec2(roomOrigin);
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
        const currentTilePos = k.vec2(roomOrigin);
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

  const player = makePlayer(k, k.vec2(30, 300));
  player.setControls();

  k.add([
    k.rect(k.width(), 40),
    k.area(),
    k.body({ isStatic: true }),
    k.pos(0, 500),
  ]);

  k.add([
    k.rect(100, 20),
    k.area(),
    k.body({ isStatic: true }),
    k.pos(100, 450),
  ]);

  k.onUpdate(() => {
    //k.camPos(k.center());
    k.camPos(player.pos.x, 400);
  });
}
