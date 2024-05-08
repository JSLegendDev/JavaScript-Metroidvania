export const statePropsEnum = {
  playerHp: "playerHp",
  isDoubleJumpUnlocked: "isDoubleJumpUnlocked",
  playerInBossFight: "playerInBossFight",
  isBossDefeated: "isBossDefeated",
};

function initStateManager() {
  const state = {
    playerHp: 3,
    maxPlayerHp: 3,
    isDoubleJumpUnlocked: false,
    playerInBossFight: false,
    isBossDefeated: false,
  };

  return {
    current() {
      return { ...state };
    },
    set(property, value) {
      state[property] = value;
    },
  };
}

export const state = initStateManager();
