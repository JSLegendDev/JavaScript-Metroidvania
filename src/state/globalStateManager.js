function initStateManager() {
  const state = {
    playerHp: 3,
    doubleJumpUnlock: false,
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
