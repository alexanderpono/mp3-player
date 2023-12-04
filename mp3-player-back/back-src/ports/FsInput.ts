import fs from 'fs';

export interface FileStats {
    name: string;
    size: number;
    emptyDir?: boolean;
}
export const DIRECTORY = -1;

export class FsInput {
    openDirectory = async (path: string): Promise<fs.Dir> => await fs.promises.opendir(path);
    getFileStats = async (filePath: string): Promise<fs.Stats> => await fs.promises.stat(filePath);

    getDirStats = async (
        rootPath: string,
        localDirPath: string,
        skipFiles: string[],
        depth: number
    ): Promise<FileStats[]> => {
        const result: FileStats[] = [];
        const dirHandle = await this.openDirectory(rootPath);
        const toSkip = new Set(skipFiles);
        for await (const dirent of dirHandle) {
            if (toSkip.has(dirent.name)) {
                console.log(`skipping ${dirent.name}`);
                continue;
            }
            const filePath = rootPath + '/' + dirent.name;
            const localPath = localDirPath + '/' + dirent.name;
            const stats = await this.getFileStats(filePath);
            const isDirectory = stats.isDirectory();
            const size = isDirectory ? DIRECTORY : stats.size;
            if (stats.isDirectory() && depth > 0) {
                const subResult = await this.getDirStats(filePath, localPath, skipFiles, depth - 1);
                if (Object.keys(subResult).length === 0) {
                    result.push({
                        name: localPath,
                        size: DIRECTORY,
                        emptyDir: true
                    });
                }
                Object.entries(subResult).forEach(([path, data]) => {
                    result.push(data);
                });
                continue;
            }
            result.push({ name: localPath, size });
        }
        const filtered = result.filter((file: FileStats) => {
            return file.name.toUpperCase().indexOf('.MP3') >= 0;
        });

        return filtered;
    };
}
