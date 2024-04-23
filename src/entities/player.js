export function makePlayer(k) {
  return k.add([
    k.pos(),
    k.sprite("player", { anim: "idle" }),
    k.area(),
    k.body(),
    {
      speed: 100,
      setControls() {
        k.onKeyPress((key) => {
          if (key === "space" && this.isGrounded()) {
            this.jump();
          }
        });

        k.onKeyDown((key) => {
          if (key === "left") {
            this.move(-this.speed, 0);
            return;
          }

          if (key === "right") {
            this.move(this.speed, 0);
            return;
          }
        });
      },
    },
  ]);
}
