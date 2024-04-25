export function makePlayer(k) {
  return k.make([
    k.pos(),
    k.sprite("player", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 16), 16, 16) }),
    k.anchor("center"),
    k.body({ mass: 1000 }),
    "player",
    {
      speed: 150,
      setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
      },
      setControls() {
        k.onKeyPress((key) => {
          if (key === "space" && this.isGrounded()) {
            if (this.curAnim() !== "jump") this.play("jump");
            this.jump();
          }
        });

        k.onKeyDown((key) => {
          if (key === "left") {
            if (this.curAnim() !== "run") this.play("run");

            this.flipX = true;
            this.move(-this.speed, 0);
            return;
          }

          if (key === "right") {
            if (this.curAnim() !== "run") this.play("run");
            this.flipX = false;
            this.move(this.speed, 0);
            return;
          }
        });

        k.onKeyRelease(() => {
          if (this.curAnim() !== "idle" && this.curAnim() !== "jump")
            this.play("idle");
        });
      },
    },
  ]);
}
