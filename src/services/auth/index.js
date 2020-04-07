import Client from '../Client';

const defaultURL = '/auth/';

export const refreshToken = () =>
    Client.api.get(`${defaultURL}refresh/`);

export const login = payload =>
    Client.api.post(`${defaultURL}login/`, payload);

export const register = payload =>
    Client.api.post(`${defaultURL}register/`, payload);