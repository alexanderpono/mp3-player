import { REST_SERVER_PORT } from '@src/const';
import axios, { AxiosResponse } from 'axios';

export interface FileStats {
    name: string;
    size: number;
}

export interface GetFilesAnswer {
    files: FileStats[];
}
export const defaultGetFilesAnswer: GetFilesAnswer = {
    files: []
};

export class FileStorageApi {
    getDir = (): Promise<AxiosResponse<GetFilesAnswer>> => {
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
