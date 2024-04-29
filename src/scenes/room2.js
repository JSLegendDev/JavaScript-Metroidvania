import { setBackgroundColor } from "./roomUtils.js";

export function room2(k, roomData) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(170, 270);
  k.setGravity(1000);
}
