import { state } from "../state/globalStateManager.js";

export function makeCartridge(k, pos) {
  const cartridge = k.make([
    k.sprite("cartridge", { anim: "default" }),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
  ]);

  cartridge.onCollide("player", (player) => {
    k.play("health", { volume: 0.5 });
    if (player.hp() < state.current().maxPlayerHp) {
      player.heal(1);
    }
    k.destroy(cartridge);
  });

  return cartridge;
}
