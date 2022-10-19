import * as actions from "./actionTypes";

export function taskReducer(state, action) {
  switch (action.type) {
    case actions.taskUpdated:
      const newState = [...state];
      const elementIndex = newState.findIndex(
        (el) => el.id === action.payload.id
      );
      newState[elementIndex] = { ...newState[elementIndex], ...action.payload };
      return newState;
    case actions.taskDeleted:
      return state.filter((t) => t.id !== action.payload.id);
    default:
      return state;
  }
}
