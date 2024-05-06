import { state } from "../state/GlobalStateManager.js";

export function makeBoss(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("burner", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 12, 12) }),
    k.body({ mass: 100, jumpForce: 320 }),
    k.anchor("center"),
    k.state("idle", ["idle", "follow", "open-fire", "fire", "shut-fire"]),
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
          if (this.pos.dist(player.pos) < this.fireRange) {
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

        this.onStateEnter("open-fire", () => {
          this.play("open-fire", {
            onEnd: () => {
              this.enterState("fire");
            },
          });
        });

        this.onStateEnter("fire", () => {
          this.add([k.rect(100, 10), k.area(), "fire-hitbox"]);

          k.wait(4, () => {
            this.enterState("shut-fire");
          });
        });

        this.onStateEnd("fire", () => {
          k.destroy(k.get("fire-hitbox", { recursive: true })[0]);
        });

        this.onStateUpdate("fire", () => {
          if (this.curAnim() !== "fire") this.play("fire");
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
