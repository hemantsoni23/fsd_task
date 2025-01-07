import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";

export const Store = configureStore({
    reducer: {
        auth: authReducer
    }
});