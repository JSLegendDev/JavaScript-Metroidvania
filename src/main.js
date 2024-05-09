import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";
import { room2 } from "./scenes/room2.js";
import { setBackgroundColor } from "./scenes/roomUtils.js";
import { makeNotificationBox } from "./ui/notificationBox.js";

async function main() {
  const room1Data = await (await fetch("../maps/room1.json")).json();
  const room2Data = await (await fetch("../maps/room2.json")).json();

  const electricBackground = k.play("electric-background", { loop: true });
  electricBackground.pause = true;

  k.scene("room1", (previousSceneData) => {
    electricBackground.play(electricBackground.time());
    room1(k, room1Data, previousSceneData);
    k.onSceneLeave(() => (electricBackground.pause = true));
  });
  k.scene("room2", (previousSceneData) => {
    electricBackground.play(electricBackground.time());
    room2(k, room2Data, previousSceneData);
    k.onSceneLeave(() => (electricBackground.pause = true));
  });

  k.scene("final-exit", () => {
    electricBackground.pause = true;
    setBackgroundColor(k, "#20214a");
    k.add(
      makeNotificationBox(
        k,
        "You escaped the factory!\n The End. Thanks for playing!"
      )
    );
  });
}

k.scene("intro", () => {
  setBackgroundColor(k, "#20214a");
  k.add(
    makeNotificationBox(
      k,
      "Escape the factory!\nUse arrow keys to move, x to jump, z to attack.\nPress Enter to start!"
    )
  );
  k.onKeyPress("enter", () => k.go("room1", { exitName: null }));
});

k.go("intro");

main();
