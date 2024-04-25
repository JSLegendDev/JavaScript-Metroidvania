import kaboom from "../lib/kaboom.mjs";

export const scale = 2;
export const k = kaboom({
  width: 640 * scale,
  height: 360 * scale,
  scale,
  letterbox: true,
});
k.loadSprite("player", "../assets/sprites/u.png", {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: { from: 0, to: 7, loop: true },
    run: { from: 8, to: 13, loop: true },
    jump: { from: 49, to: 52 },
  },
});
k.loadSprite("tileset", "../assets/tileset.png", {
  sliceX: 33,
  sliceY: 21,
});

k.loadSprite("background", "../assets/background.png", {
  sliceX: 13,
  sliceY: 25,
});
