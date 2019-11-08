import { FileService } from 'data-science-lab-core';
import { dialog } from 'electron';
import * as fs from 'fs';

export class AppFileCoreService implements FileService {
    openFile(callback: (buffer: Buffer) => void,
             filters?: { name: string, extensions: string[] }[]) {
        dialog.showOpenDialog({
            title: 'Open a file',
            filters,
        }, (filenames) => {
            if (!filenames) { return; }
            callback(fs.readFileSync(filenames[0]));
        });
    }
}
