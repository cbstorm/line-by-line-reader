import EventEmitter from 'events';
import fs from 'fs';
import readline from 'readline';

export class LineByLineReader extends EventEmitter {
    private filePath: fs.PathLike;
    private rl: readline.Interface;
    constructor(filePath: fs.PathLike) {
        super();
        this.filePath = filePath;
        this.rl = readline.createInterface({
            input: fs.createReadStream(this.filePath, {
                encoding: 'utf-8',
            }),
            crlfDelay: Infinity,
        });
    }

    async readLine(
        callback: (line: string) => any | Promise<any>
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.rl.on('line', (line) => {
                    callback(line);
                });
                this.rl.on('close', () => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
