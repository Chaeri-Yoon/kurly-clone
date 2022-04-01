import fs from 'fs';
import path from 'path';

export default function (folderName: string): string[] {
    const directory = path.resolve('./public', folderName);
    const filenames = fs.readdirSync(directory).map(file => "/" + folderName + "/" + file);

    return filenames;
}