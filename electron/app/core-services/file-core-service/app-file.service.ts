import { FileService } from 'data-science-lab-core';
import { dialog } from 'electron';
import * as fs from 'fs'; 

export class AppFileCoreService implements FileService {
    openFile(filters?: { name: string; extensions: string[]; }[]): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            dialog.showOpenDialog({
                title: `Choose a file`,
                filters
            }, (filenames) => {
                if (!filenames) {
                    reject(`Unable to open a file`);
                }
                if (filenames.length === 0) {
                    reject(`No file selected`);
                } else {
                    const file = fs.readFileSync(filenames[0]);
                    resolve(file);
                }
            });
        });
    }
}
