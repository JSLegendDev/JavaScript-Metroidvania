export function makeHealthBar(k) {
  k.add([
    k.sprite("healthBar", { frame: 2 }),
    k.fixed(),
    k.pos(10, 10),
    k.scale(4),
  ]);
}
