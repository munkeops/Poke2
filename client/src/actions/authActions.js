import axios from "axios";
import { returnErrors } from "./errorActions";
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

//Check token and load user
export const loadUser = () => (dispatch, getState) => {
  //User loading
  dispatch({ type: USER_LOADING });
  axios
    .get(
      "https://poke2se-server.herokuapp.com/api/auth/user",
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

export const register = ({ username, password, email }) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  //Request data
  const body = JSON.stringify({ username, email, password });

  axios
    .post("https://poke2se-server.herokuapp.com/api/users", body, config)
    .then((res) => dispatch({ type: REGISTER_SUCCESS, payload: res.data }))
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({ type: REGISTER_FAIL });
    });
};

//Serup config/headers and token
export const tokenConfig = (getState) => {
  //Get token from localStorage
  const token = getState().auth.token;

  //Request with headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  if (token) {
    config.headers["x-auth-token"] = token; //If token exists, add to header
  }

  return config;
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const login = ({ username, password }) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = JSON.stringify({ username, password });

  axios
    .post("https://poke2se-server.herokuapp.com/api/auth", body, config)
    .then((res) => dispatch({ type: LOGIN_SUCCESS, payload: res.data }))
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({ type: LOGIN_FAIL });
    });
};

export const setRoom = ({ room }) => (dispatch) => {
  dispatch({ type: SET_ROOM, payload: room });
};

export const setTeam = ({ team, enemy, origTeam }) => (dispatch) => {
  dispatch({ type: SET_TEAM, payload: { team, enemy, origTeam } });
};

export const setSocket = (socket) => (dispatch) => {
  dispatch({ type: SET_SOCKET, payload: socket });
};

export const updateTeam = (team) => (dispatch) => {
  dispatch({ type: UPDATE_TEAM, payload: team });
};
