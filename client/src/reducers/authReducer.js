import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_ROOM,
  SET_TEAM,
  SET_SOCKET,
  UPDATE_TEAM,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  room: null,
  team: null,
  origTeam: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case SET_ROOM:
      console.log("SETTING ROOM", action.payload);
      return {
        ...state,
        room: action.payload,
      };
    case SET_TEAM:
      console.log("TEAM: ", action.payload);
      return {
        ...state,
        team: action.payload.team,
        enemy: action.payload.enemy,
        origTeam: action.payload.origTeam,
      };
    case SET_SOCKET:
      console.log("SOCKET: ", action.payload);
      return {
        ...state,
        socket: action.payload,
      };
    case UPDATE_TEAM:
      console.log(state.origTeam, action.payload);
      return {
        ...state,
        team: action.payload,
      };
    default:
      return state;
  }
}
