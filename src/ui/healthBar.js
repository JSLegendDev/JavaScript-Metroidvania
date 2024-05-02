import { state } from "../state/GlobalStateManager.js";
import { k } from "../kaboomLoader.js";

function makeHealthBar(k) {
  return k.make([
    k.sprite("healthBar", { frame: 0 }),
    k.fixed(),
    k.pos(10, 10),
    k.scale(4),
    {
      hpMapping: {
        1: 2,
        2: 1,
        3: 0,
      },
      setEvents() {
        this.on("update", () => {
          const currentHp = state.current().playerHp;
          if (currentHp === 0) {
            k.destroy(this);
            return;
          }
          this.frame = this.hpMapping[currentHp];
        });
      },
    },
  ]);
}

export const healthBar = makeHealthBar(k);
