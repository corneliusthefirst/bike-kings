import { APIClient, setAuthorization } from '../../helpers/apiClient';

import { createAsyncThunk } from '@reduxjs/toolkit';
import ReactGA from 'react-ga'

/**
 * Sets the session
 * @param {*} user
 */

const create = new APIClient().create;

const AUTH_URL = '/api/v1/auth';

/**
 * Login the user
 * @param {*} payload - email ,password and history
 */
const login = createAsyncThunk('login', async ({ email, password, navigate, setIsAuthenticated})  => {
    try {
        let response  = null
        response = await create(`${AUTH_URL}/login`, { email, password });
        const { user, tokens } = response;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokens", JSON.stringify(tokens));
        setAuthorization(tokens.access.token);
        setIsAuthenticated(true)
        ReactGA.event({
            category: 'User',
            action: 'Login Account',
          })
        navigate('/dashboard');
        return response
    } catch (error) {
        return error
    }
})

/**
 * Logout the user
 * @param {*} param0
 */
const logout = createAsyncThunk('logout', async ({ navigate, refreshToken, setIsAuthenticated }) => {
    try {
        let response  = null
        response = await create(`${AUTH_URL}/logout`, { refreshToken: refreshToken });
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
        setIsAuthenticated(false)
        ReactGA.event({
            category: 'User',
            action: 'Logout of Account',
          })
        navigate('/login');
        return response
    } catch (error) {
        return error
    }
})

/**
 * Register the user, payload - user
 */
const register = createAsyncThunk('register', async ({ user: newUser, navigate, setIsAuthenticated }) => {
    console.log("val2", newUser);
    try {
        let response = null
        response = await create(`${AUTH_URL}/register`, newUser);
        console.log("val3", response);
        const { user, tokens } = response;

       if(user && tokens) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokens", JSON.stringify(tokens));
        setAuthorization(tokens.access.token);
        setIsAuthenticated(true)
        ReactGA.event({
            category: 'User',
            action: 'Created an Account',
          })
        navigate('/dashboard');
       }

        return response
    } catch (error) {
        return error
    }
})

/**
 * forget password, payload - email
 */
const forgetPassword = createAsyncThunk('forgot-password', async ({ email }) => {
    try {
        let response = null
        response = await create(`${AUTH_URL}/forgot-password`, { email });
        return response
    } catch (error) {
        return error
    }
})

export  { login, logout, register, forgetPassword }