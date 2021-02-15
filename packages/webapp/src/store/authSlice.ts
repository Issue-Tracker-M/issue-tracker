import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../config";
import normalizeAuthResponse from "../utils/normalizeAuthResponse";
import { authenticate } from "./thunks";
import { succesfullAuthObject, User } from "./user/types";

interface initialState {
  /**
   * id of the currently logged in user
   */
  currentUserId: User["_id"] | null;
  /**
   * Authentication JWT, acquired by either exchanging refresh token or logging in with credentials
   * Must only be stored in memory!
   */
  token: string | null;
}

const initialState: initialState = {
  currentUserId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticate.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.currentUserId = action.payload.result;
    });
  },
});

export const refreshAuthToken = createAsyncThunk("refresh_token", async () => {
  const {
    data: { user, token },
  } = await axios.get<succesfullAuthObject>(`/auth/refresh`);
  return { ...normalizeAuthResponse(user), token };
});

export default authSlice.reducer;
