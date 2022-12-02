import axios from 'axios';
import config from "../config";
import { LOGIN_PAGE, LOGIN_URL, REFRESH_TOKEN_URL } from '../constants/history.constants';
import { getTokens, setLoggedInUser, setTokens } from './authUtils';


const client = axios.create({
    baseURL: config.API_URL,
    withCredentials: true,
})

// default
client.defaults.baseURL = config.API_URL;

// content type
client.defaults.headers.post['Content-Type'] = 'application/json';


client.interceptors.request.use(async (config) => {

    const tokens = getTokens();
    config.headers.Authorization = `Bearer ${tokens?.access?.token}`

    return config
})

// intercepting to capture errors
client.interceptors.response.use(function (response) {
    return response.data ? response.data : response;
}, async (err) => {

    const { status } = err.response
    const originalReq = err.config

    if (originalReq.url !== LOGIN_URL && err.response) {
        if (
          err.response.status === 401 &&
          err.response?.data?.message === 'Token not found'
        ) {
          setLoggedInUser(null)
          setTokens(null)
          window.location.replace(LOGIN_PAGE)
          return Promise.reject()
        }
  
        if (
          (err.response.status === 401 &&
            err.response?.data?.message === 'Please authenticate',
          err.config && !err.config._retry)
        ) {
          originalReq._retry = true
          const tokens = getTokens()
          const refreshToken = tokens?.refresh?.token
  
          // request to refresh token
          try {
            const res = await client.post(REFRESH_TOKEN_URL, {
              refreshToken: refreshToken,
            })
            console.log('res refresh', res)
            setLoggedInUser(res.user)
            setTokens(res.tokens)
  
            originalReq.headers[
              'Authorization'
            ] = `Bearer ${res?.tokens?.access?.token}`
            originalReq.headers['Device'] = 'device'
  
            return client(originalReq)
          } catch (_error) {
            return Promise.reject(_error)
          }
        }
    }


    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (status) {
        case 500: message = 'Internal Server Error'; break;
        case 401: message = 'Invalid credentials'; break;
        case 404: message = "Sorry! the data you are looking for could not be found"; break;
        default: message = err.message || err;
    }
    return Promise.reject(message);
});

/**
 * Sets the default authorization
 * @param {*} token 
 */
const setAuthorization = (token) => {
    client.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}


class APIClient {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        return client.get(url, params);
    }

    /**
     * post given data to url
     */
    create = (url, data) => {
        return client.post(url, data);
    }

    /**
     * Updates data
     */
    patch = (url, data) => {
        return client.patch(url, data);
    }

    /**
     * Update though put
     */
    put = (url, data) => {
        return client.put(url, data);
    }
    /**
     * Delete
     */
    delete = (url) => {
        return client.delete(url);
    }
}

export { APIClient, setAuthorization };