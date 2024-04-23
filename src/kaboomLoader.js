import kaboom from "../lib/kaboom.mjs";

export const k = kaboom();
k.loadSprite("player", "../assets/sprites/u.png", {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: 0,
  },
});
