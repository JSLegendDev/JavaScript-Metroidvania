import { makePlayer } from "../entities/player.js";

export function room1(k) {
  k.camScale(4);
  k.camPos(0, 500);
  k.setGravity(1500);
  const player = makePlayer(k);
  player.setControls();

  k.add([
    k.rect(k.width(), 40),
    k.area(),
    k.body({ isStatic: true }),
    k.pos(0, k.height() / 2),
  ]);
}
