import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class Client {
    constructor() {
        let baseUrl = 'https://242345a2.ngrok.io';

        this.api = axios.create({
            baseURL: baseUrl,
            timeout: 60000,
        });

        this.api.interceptors.response.use(
            response => {
                if (response.status) {
                    if (response.data !== undefined) {
                        return Promise.resolve(response.data);
                    } else {
                        return Promise.resolve(Response);
                    }
                } else {
                    return Promise.reject(response);
                }
            },
            error => {
                return Promise.reject(error.response.data);
            }
        );
    }

    async setTokenInHeader(token) {
        await AsyncStorage.setItem('userToken', token);
        this.api.defaults.headers.common['x-access-token'] = token;
        this.api.defaults.headers.common['Content-Type'] =
            'application/json; charset=utf-8';
    }

    async getUserToken() {
        return await AsyncStorage.getItem('userToken');
    }

    async getUserId() {
        return await AsyncStorage.getItem('userId');
    }

    async getUserName() {
        return await AsyncStorage.getItem('userName');
    }

    async getUserEmail() {
        return await AsyncStorage.getItem('userEmail');
    }

    async getUserPhoto() {
        return await AsyncStorage.getItem('userPhoto');
    }

    async logout() {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userPhoto');

        this.api.defaults.headers.common['x-access-token'] = '';
    }
}

export default new Client();
