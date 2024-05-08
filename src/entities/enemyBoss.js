import { state, statePropsEnum } from "../state/GlobalStateManager.js";
import { makeBlink } from "./entitySharedLogic.js";

export function makeBoss(k, initialPos) {
  return k.make([
    k.pos(initialPos),
    k.sprite("burner", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 10), 12, 12) }),
    k.body({ mass: 100, jumpForce: 320 }),
    k.anchor("center"),
    k.state("idle", [
      "idle",
      "follow",
      "open-fire",
      "fire",
      "shut-fire",
      "explode",
    ]),
    k.health(15),
    k.opacity(1),
    {
      pursuitSpeed: 100,
      fireRange: 40,
      fireDuration: 1,
      setBehavior() {
        const player = k.get("player", { recursive: true })[0];

        this.onStateUpdate("idle", () => {
          if (state.current().playerInBossFight) {
            this.enterState("follow");
          }
        });

        this.onStateUpdate("follow", () => {
          if (this.curAnim() !== "run") this.play("run");
          this.flipX = player.pos.x <= this.pos.x;
          this.moveTo(
            k.vec2(player.pos.x, player.pos.y + 12),
            this.pursuitSpeed
          );

          if (this.pos.dist(player.pos) < this.fireRange) {
            this.enterState("open-fire");
          }
        });

        this.onStateEnter("open-fire", () => {
          this.play("open-fire");
        });

        this.onStateEnter("fire", () => {
          const fireHitbox = this.add([
            k.area({ shape: new k.Rect(k.vec2(0), 70, 10) }),
            k.pos(this.flipX ? -70 : 0, 5),
            "fire-hitbox",
          ]);

          fireHitbox.onCollide("player", () => {
            player.hurt(1);
            if (player.hp() === 0)
              state.set(statePropsEnum.playerInBossFight, false);
          });

          k.wait(this.fireDuration, () => {
            this.enterState("shut-fire");
          });
        });

        this.onStateEnd("fire", () => {
          const fireHitbox = k.get("fire-hitbox", { recursive: true })[0];
          if (fireHitbox) k.destroy(fireHitbox);
        });

        this.onStateUpdate("fire", () => {
          if (this.curAnim() !== "fire") this.play("fire");
        });

        this.onStateEnter("shut-fire", () => {
          this.play("shut-fire");
        });
      },
      setEvents() {
        const player = k.get("player", { recursive: true })[0];

        this.onCollide("sword-hitbox", () => {
          this.hurt(1);
        });

        this.onAnimEnd((anim) => {
          switch (anim) {
            case "open-fire":
              this.enterState("fire");
              break;
            case "shut-fire":
              this.enterState("follow");
              break;
            case "explode":
              k.destroy(this);
              break;
            default:
          }
        });

        this.on("explode", () => {
          this.enterState("explode");
          this.collisionIgnore = ["player"];
          this.unuse("body");
          this.play("explode");
          state.set(statePropsEnum.isBossDefeated, true);
          state.set(statePropsEnum.isDoubleJumpUnlocked, true);
          player.enableDoubleJump();
          state.set(statePropsEnum.playerInBossFight, false);
          const bossBarrier = k.get("boss-barrier", { recursive: true })[0];
          if (bossBarrier) k.destroy(bossBarrier);
        });

        this.on("hurt", () => {
          makeBlink(k, this);
          if (this.hp() > 0) return;
          this.trigger("explode");
        });
      },
    },
  ]);
}
