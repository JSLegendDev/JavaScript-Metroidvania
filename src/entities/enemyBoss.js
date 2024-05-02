export function makeBoss(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("burner", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(-20, 10), 12, 12) }),
    k.body(),
    k.anchor("center"),
  ]);
}
