export function makePlayer(k) {
  return k.make([
    k.pos(),
    k.sprite("player", { anim: "idle" }),
    k.area({ shape: new k.Rect(k.vec2(0, 18), 12, 12) }),
    k.anchor("center"),
    k.body({ mass: 100, jumpForce: 320 }),
    k.doubleJump(2),
    "player",
    {
      speed: 150,
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
        k.onKeyPress((key) => {
          if (key === "space") {
            if (this.curAnim() !== "jump") this.play("jump");
            this.doubleJump();
          }
        });

        this.onFall(() => {
          this.play("fall");
        });

        this.onHeadbutt(() => {
          this.play("fall");
        });

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
        });

        k.onKeyRelease(() => {
          if (
            this.curAnim() !== "idle" &&
            this.curAnim() !== "jump" &&
            this.curAnim() !== "fall"
          )
            this.play("idle");
        });

        this.onGround(() => {
          this.play("idle");
        });
      },
    },
  ]);
}
