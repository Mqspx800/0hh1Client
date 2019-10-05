import { INIT_BOARD } from "../actions";

export default function(state = [], action) {
  switch (action.type) {
    case INIT_BOARD:
      return action.board;
    default:
      return state;
  }
}
