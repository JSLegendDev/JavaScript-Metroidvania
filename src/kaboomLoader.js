import kaboom from "../lib/kaboom.mjs";

export const k = kaboom();
k.loadSprite("player", "../assets/sprites/u.png", {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: { from: 0, to: 7, loop: true },
    run: { from: 8, to: 13, loop: true },
    jump: { from: 49, to: 52 },
  },
});
