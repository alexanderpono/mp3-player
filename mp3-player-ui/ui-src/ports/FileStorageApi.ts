import { REST_SERVER_PORT } from '@config/const';
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
                console.log('getDir() response=', response);
                return response;
            })
            .catch(function (error) {
                console.log('getDir() error=', error);
                return error;
            });
    };

    eject = () => {
        return axios.get(`http://localhost:${REST_SERVER_PORT}/eject/`);
    };
}
