import { publicRequest } from "../requestMethod";

import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutSuccess,
  updateInfoSuccess,
} from "./userSlice";

export const login = async (/** @type {(arg0: { payload: any; type: "user/loginStart" | "user/loginSuccess" | "user/loginFailed"; }) => void} */ dispatch, /** @type {any} */ user) => {
  dispatch(loginStart());
  try {
    const result = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(result.data));

    window.location.href = "/home";
  } catch (error) {
    dispatch(loginFailed());
    // toast.error("Invalid Email or Password", {
    //   duration: 4000,
    //   position: "top-center",
    //   style: { background: "red", color: "white" },
    // });
  }
};

export const logout = async (/** @type {(arg0: { payload: undefined; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/logoutSuccess"; }) => void} */ dispatch) => {
  dispatch(logoutSuccess());
  window.location.href = "/sign-in";
};

export const update = async (/** @type {(arg0: { payload: any; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/updateInfoSuccess"; }) => void} */ dispatch, /** @type {any} */ user) => {
  const result = await publicRequest.put("/user/update", user);
  dispatch(updateInfoSuccess(result.data));
  window.location.reload();
};

export const deleteAccount = async (/** @type {(arg0: { payload: undefined; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/logoutSuccess"; }) => void} */ dispatch, /** @type {string} */ user) => {
  const result = await publicRequest.delete("/user/delete/" + user);
  dispatch(logoutSuccess(result.data));

  window.location.href = "/sign-in";
};
