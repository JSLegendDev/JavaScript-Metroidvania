import { state } from "../state/GlobalStateManager.js";

export function makeBoss(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("burner", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 12, 12) }),
    k.body(),
    k.anchor("center"),
    k.state("idle", [
      "idle",
      "follow",
      "jump",
      "open-fire",
      "fire",
      "shut-fire",
    ]),
    k.health(30),
    {
      pursuitSpeed: 50,
      fireRange: 30,
      setBehavior() {
        const player = k.get("player", { recursive: true })[0];

        this.onStateUpdate("idle", () => {
          if (state.current().playerInBossFight) {
            this.enterState("follow");
          }
        });

        this.onStateUpdate("follow", () => {
          if (player.pos.y + 100 < this.pos.y) {
            this.enterState("jump");
            return;
          }

          if (this.pos.dist(player.pos) < this.range) {
            this.enterState("open-fire");
            return;
          }

          if (this.curAnim() !== "run") this.play("run");
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(
            k.vec2(player.pos.x, player.pos.y + 12),
            this.pursuitSpeed
          );
        });

        this.onStateEnter("jump", () => {
          this.jump();
          this.enterState("follow");
        });

        this.onStateEnter("open-fire", () => {
          this.play("open-fire", {
            onEnd: () => {
              this.enterState("fire");
            },
          });
        });

        this.onStateEnter("fire", () => {
          this.add([k.rect(100, 10), k.area(), "fire-hitbox"]);
          this.play("fire");
          k.wait(4, () => {
            this.enterState("shut-fire");
          });
        });

        this.onStateEnd("fire", () => {
          k.destroy("fire-hitbox");
        });

        this.onStateEnter("shut-fire", () => {
          this.play("shut-fire", {
            onEnd: () => {
              this.enterState("follow");
            },
          });
        });
      },
      setEvents() {},
    },
  ]);
}
