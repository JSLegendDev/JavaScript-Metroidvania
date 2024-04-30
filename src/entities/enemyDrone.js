export function makeDrone(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("drone", { anim: "flying" }),
    k.area({ shape: new k.Rect(k.vec2(0), 12, 12) }),
    k.anchor("center"),
    k.body({ isStatic: true }),
    k.state("patrol-right", [
      "patrol-right",
      "patrol-left",
      "alert",
      "attack",
      "retreat",
    ]),
    "drone",
    {
      speed: 100,
      pursuitSpeed: 150,
      range: 100,
      setBehavior() {
        const player = k.get("player", { recursive: true })[0];

        this.onStateEnter("patrol-right", async () => {
          await k.wait(3);
          if (this.state === "patrol-right") this.enterState("patrol-left");
        });

        this.onStateUpdate("patrol-right", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.flipX = false;
          this.move(this.speed, 0);
        });

        this.onStateEnter("patrol-left", async () => {
          await k.wait(3);
          if (this.state === "patrol-left") this.enterState("patrol-right");
        });

        this.onStateUpdate("patrol-left", () => {
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("alert");
            return;
          }
          this.flipX = true;
          this.move(-this.speed, 0);
        });

        this.onStateUpdate("retreat", () => {
          if (!this.pos.eq(initialPos)) {
            this.flipX = 0 <= this.pos.angleBetween(initialPos);
            this.moveTo(initialPos, this.speed);
            return;
          }

          this.enterState("patrol-right");
        });

        this.onStateEnter("alert", async () => {
          await k.wait(2);
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("attack");
            return;
          }

          this.enterState("retreat");
        });

        this.onStateUpdate("attack", () => {
          if (this.pos.dist(player.pos) > this.range) {
            this.enterState("alert");
          }

          this.flipX = player.direction === "left";
          this.moveTo(player.pos, this.pursuitSpeed);
        });
      },
    },
  ]);
}
