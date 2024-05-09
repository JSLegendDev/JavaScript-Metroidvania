import kaboom from "../lib/kaboom.mjs";

export const scale = 2;
export const k = kaboom({
  width: 640 * scale,
  height: 360 * scale,
  scale,
  letterbox: true,
});

k.loadFont("glyphmesss", "../assets/glyphmesss.ttf");

k.loadSprite("player", "../assets/sprites/u.png", {
  sliceX: 8,
  sliceY: 9,
  anims: {
    idle: { from: 0, to: 7, loop: true },
    run: { from: 8, to: 13, loop: true },
    jump: { from: 51, to: 51, loop: true },
    fall: { from: 54, to: 54, loop: true },
    explode: { from: 64, to: 69 },
    attack: { from: 24, to: 28, speed: 16 },
  },
});

k.loadSprite("drone", "../assets/sprites/dr0ne.png", {
  sliceX: 6,
  sliceY: 3,
  anims: {
    flying: { from: 0, to: 3, loop: true },
    attack: { from: 6, to: 11, loop: true },
    explode: { from: 12, to: 17 },
  },
});

k.loadSprite("burner", "../assets/sprites/burn3r.png", {
  sliceX: 5,
  sliceY: 6,
  anims: {
    idle: { from: 0, to: 3, loop: true },
    run: { from: 6, to: 8, loop: true },
    "open-fire": { from: 10, to: 14 },
    fire: { from: 15, to: 18, loop: true },
    "shut-fire": { from: 20, to: 23 },
    explode: { from: 25, to: 29 },
  },
});

k.loadSpriteAtlas("../assets/ui.png", {
  healthBar: {
    x: 16,
    y: 16,
    width: 60,
    height: 48,
    sliceY: 3,
  },
});

k.loadSpriteAtlas("../assets/animations.png", {
  cartridge: {
    x: 125,
    y: 145,
    width: 134,
    height: 16,
    sliceX: 8,
    anims: {
      default: { from: 0, to: 4, loop: true, speed: 7 },
    },
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

k.loadSound("notify", "../assets/sounds/notify.mp3");
k.loadSound("boom", "../assets/sounds/boom.wav");
k.loadSound("health", "../assets/sounds/health.wav");
k.loadSound("flamethrower", "../assets/sounds/flamethrower.mp3");
k.loadSound("electric-background", "../assets/sounds/electric-background.mp3");

k.loadSprite("room1", "../maps/room1.png");
k.loadSprite("room2", "../maps/room2.png");
