export const REQUIRED_WS_KEYS = {
  TYPE: 'type',
  DATA: 'data',
  ID: 'id',
} as const;

export const WS_MESSAGE_TYPES = {
  REG: 'reg',
  UPDATE_WINNERS: 'update_winners',
  CREATE_ROOM: 'create_room',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  CREATE_GAME: 'create_game',
  UPDATE_ROOM: 'update_room',
  ADD_SHIPS: 'add_ships',
  START_GAME: 'start_game',
  ATTACK: 'attack',
  RANDOM_ATTACK: 'randomAttack',
  TURN: 'turn',
  FINISH: 'finish',
  SINGLE_PLAY: 'single_play',
} as const;

export const HIT_RESULTS = {
  MISS: 'miss',
  KILLED: 'killed',
  SHOT: 'shot',
} as const;

export const SHIP_TYPES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
} as const;
