import Client from '../Client';

const defaultURL = '/stories/';

export const storiesList = (page, page_size) =>
    Client.api.get(`${defaultURL}?page=${page}&page_size=${page_size}`);