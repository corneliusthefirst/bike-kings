
import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './authSlice/authSlice';
import LayoutReducer from './layoutSlice/layoutSlice';
import ChatReducer from './chatSlice/chatSlice';

export default combineReducers({
    Auth: AuthReducer,
    Chat: ChatReducer,
    Layout: LayoutReducer
});