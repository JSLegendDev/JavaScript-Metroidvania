export function makeDrone(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("drone", { anim: "flying" }),
    k.area({ shape: new k.Rect(k.vec2(0), 12, 12) }),
    k.anchor("center"),
    k.body({ gravityScale: 0 }),
    k.offscreen({ distance: 400 }),
    k.state("patrol-right", [
      "patrol-right",
      "patrol-left",
      "alert",
      "attack",
      "retreat",
    ]),
    k.health(1),
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

        this.onStateEnter("alert", async () => {
          await k.wait(1);
          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("attack");
            return;
          }

          this.enterState("patrol-right");
        });

        this.onStateUpdate("attack", () => {
          if (this.pos.dist(player.pos) > this.range) {
            this.enterState("alert");
            return;
          }

          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(
            k.vec2(player.pos.x, player.pos.y + 12),
            this.pursuitSpeed
          );
        });
      },

      setEvents() {
        const player = k.get("player", { recursive: true })[0];

        this.onCollide("player", () => {
          if (player.isAttacking) return;
          this.hurt(1);
          player.hurt(1);
        });

        this.onAnimEnd((anim) => {
          if (anim === "explode") {
            k.destroy(this);
          }
        });

        this.on("explode", () => {
          k.play("boom");
          this.collisionIgnore = ["player"];
          this.unuse("body");
          this.play("explode");
        });

        this.onCollide("sword-hitbox", () => {
          this.hurt(1);
        });

        // event defined by default by the health component
        // when health is removed
        this.on("hurt", () => {
          if (this.hp() === 0) {
            this.trigger("explode");
          }
        });

        this.onExitScreen(() => {
          if (this.pos.dist(initialPos) > 400) this.pos = initialPos;
        });
      },
    },
  ]);
}
