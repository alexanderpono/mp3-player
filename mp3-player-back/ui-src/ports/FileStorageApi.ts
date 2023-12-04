import { REST_SERVER_PORT } from '@src/const';
import axios, { AxiosResponse } from 'axios';

export class FileStorageApi {
    getDir = (): Promise<AxiosResponse<string>> => {
        return axios
            .get(`http://localhost:${REST_SERVER_PORT}/folder/`)
            .then(function (response) {
                // handle success
                console.log('getDir() response=', response);
                return response;
            })
            .catch(function (error) {
                // handle error
                console.log('getDir() error=', error);
                return error;
            });
    };
}
