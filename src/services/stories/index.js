import Client from '../Client';
import RNFetchBlob from 'rn-fetch-blob';
import { API_URL } from 'react-native-dotenv';

const defaultURL = '/stories/';

export const storiesList = (page, page_size) =>
    Client.api.get(`${defaultURL}?page=${page}&page_size=${page_size}`);

export const uploadStories = async (uri, type, fileType) => {
    return new Promise(async (resolve, reject) => {
        let authToken = await Client.getUserToken()
        let result = await RNFetchBlob.fetch(
            'POST',
            `${API_URL}/stories/upload?folder=drops&type=${fileType}`,
            {
                'Content-Type': 'multipart/form-data',
                'x-access-token': authToken
            },
            [
                {
                    name: 'media',
                    filename: type.split('/')[0] + '.' + type.split('/')[1],
                    type: type,
                    data: RNFetchBlob.wrap(uri),
                },
            ],
        )
        const resultData = JSON.parse(result.data)
        if (resultData.success) {
            resolve(resultData)
        } else {
            reject(resultData)
        }

    })
}