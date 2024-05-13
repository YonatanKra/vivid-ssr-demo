import { readFile } from 'fs';

export async function getFileContents(filePath) {
    return new Promise((res, rej) => {
        readFile(filePath, (err, content) => {
            if (err) {
                rej(err);
                return;
            }
            res(content);
        })
    });
}   