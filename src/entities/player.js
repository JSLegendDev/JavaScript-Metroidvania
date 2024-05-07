import { state } from "../state/GlobalStateManager.js";
import { maxPlayerHp } from "../state/constants.js";
import { healthBar } from "../ui/healthBar.js";
import { makeBlink } from "./entitySharedLogic.js";

export function makePlayer(k) {
  return k.make([
    k.pos(),
    k.sprite("player"),
    k.area({ shape: new k.Rect(k.vec2(0, 18), 12, 12) }),
    k.anchor("center"),
    k.body({ mass: 100, jumpForce: 320 }),
    k.doubleJump(1),
    k.opacity(),
    "player",
    {
      speed: 150,
      isAttacking: false,
      setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
      },
      enablePassthrough() {
        this.onBeforePhysicsResolve((collision) => {
          if (collision.target.is("passthrough") && this.isJumping()) {
            collision.preventResolution();
          }
        });
      },
      setControls() {
        this.controlHandlers = [];

        this.controlHandlers.push(
          k.onKeyPress((key) => {
            if (key === "space") {
              if (this.curAnim() !== "jump") this.play("jump");
              this.doubleJump();
            }

            if (
              key === "z" &&
              this.curAnim() !== "attack" &&
              this.isGrounded()
            ) {
              this.isAttacking = true;
              this.add([
                k.pos(this.flipX ? -25 : 0, 10),
                k.area({ shape: new k.Rect(k.vec2(0), 25, 10) }),
                "sword-hitbox",
              ]);
              this.play("attack");

              this.onAnimEnd((anim) => {
                if (anim === "attack") {
                  const swordHitbox = k.get("sword-hitbox", {
                    recursive: true,
                  })[0];
                  if (swordHitbox) k.destroy(swordHitbox);
                  this.isAttacking = false;
                  this.play("idle");
                }
              });
            }
          })
        );

        this.controlHandlers.push(
          this.onFall(() => {
            this.play("fall");
          })
        );

        // when player falls off a platform
        this.controlHandlers.push(
          this.onFallOff(() => {
            this.play("fall");
          })
        );

        this.controlHandlers.push(
          this.onGround(() => {
            this.play("idle");
          })
        );

        this.controlHandlers.push(
          this.onHeadbutt(() => {
            this.play("fall");
          })
        );

        this.controlHandlers.push(
          k.onKeyDown((key) => {
            if (key === "left") {
              if (this.curAnim() !== "run" && this.isGrounded()) {
                this.play("run");
              }
              this.flipX = true;
              this.move(-this.speed, 0);
              return;
            }

            if (key === "right") {
              if (this.curAnim() !== "run" && this.isGrounded()) {
                this.play("run");
              }
              this.flipX = false;
              this.move(this.speed, 0);
              return;
            }
          })
        );

        this.controlHandlers.push(
          k.onKeyRelease(() => {
            if (
              this.curAnim() !== "idle" &&
              this.curAnim() !== "jump" &&
              this.curAnim() !== "fall" &&
              this.curAnim() !== "attack"
            )
              this.play("idle");
          })
        );
      },

      disableControls() {
        for (const handler of this.controlHandlers) {
          handler.cancel();
        }
      },

      setEvents() {
        this.on("hit", () => {
          makeBlink(k, this);
          state.set("playerHp", state.current().playerHp - 1);
          healthBar.trigger("update");

          if (state.current().playerHp !== 0) return;

          this.disableControls();
          state.set("playerHp", maxPlayerHp);
          this.play("explode", { onEnd: () => k.go("room1") });
        });
      },

      enableDoubleJump() {
        this.numJumps = 2;
      },
    },
  ]);
}
