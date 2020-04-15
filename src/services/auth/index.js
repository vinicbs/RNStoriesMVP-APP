import Client from '../Client';
import RNFetchBlob from 'rn-fetch-blob';
import { API_URL } from 'react-native-dotenv';

const defaultURL = '/auth/';

export const refreshToken = () =>
    Client.api.get(`${defaultURL}refresh/`);

export const login = payload =>
    Client.api.post(`${defaultURL}login/`, payload);

export const register = payload =>
    Client.api.post(`${defaultURL}register/`, payload);

export const uploadPhoto = async (uri, type, userId) => {
    return new Promise(async (resolve, reject) => {
        let authToken = await Client.getUserToken()
        let result = await RNFetchBlob.fetch(
            'POST',
            `${API_URL}/auth/upload?folder=users`,
            {
                'Content-Type': 'multipart/form-data',
                'x-access-token': authToken
            },
            [
                {
                    name: 'media',
                    filename: userId + '.' + type.split('/')[1],
                    type: type,
                    data: RNFetchBlob.wrap(uri),
                },
            ],
        )
        const resultData = JSON.parse(result.data)
        if(resultData.success) {
            resolve(resultData)
        } else {
            reject(resultData)
        }
        
    })
}