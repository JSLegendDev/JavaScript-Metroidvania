export function drawLayer(
  k,
  layer,
  layerOriginPos,
  tilesetName,
  tileSize,
  tilesetOffset = 0
) {
  const currentTilePos = k.vec2(layerOriginPos);
  let nbTilesDrawn = 0;
  for (const tile of layer.data) {
    if (nbTilesDrawn % layer.width === 0) {
      currentTilePos.x = 0;
      currentTilePos.y += tileSize;
    } else {
      currentTilePos.x += tileSize;
    }

    nbTilesDrawn++;
    if (tile === 0) continue;

    k.drawSprite({
      sprite: tilesetName,
      frame: tile - tilesetOffset - 1,
      pos: currentTilePos,
    });
  }
}
