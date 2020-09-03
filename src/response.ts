import * as http from 'http';
import * as stream from 'stream';
import { Headers } from './headers';

export class Response {

    private readonly _headers: Headers;
    private readonly _message: http.IncomingMessage;

    constructor(message: http.IncomingMessage) {
        this._message = message;
        this._headers = new Headers(this._message.headers);
    }

    public get ok(): boolean {
        return this._message.aborted ? false : true;
    }

    public get status(): number {
        return this._message.statusCode;
    }

    public get headers(): Headers {
        return this._headers;
    }

    public get body(): stream.Readable {
        return this._message;
    }

    private async buffer(): Promise<Buffer> {
        if(!this._message.readable) {
            throw new Error('Failed to read from stream!');
        }
        return await new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            this.body
                .on('error', reject)
                .on('data', chunk => chunks.push(chunk as Buffer))
                .on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    private async bytes(): Promise<Uint8Array> {
        return Uint8Array.from(await this.buffer());
    }

    public async arrayBuffer(): Promise<ArrayBuffer> {
        return (await this.bytes()).buffer;
    }

    public async text(): Promise<string> {
        return (await this.buffer()).toString('utf8');
    }

    public async json<T=any>(): Promise<T> {
        return JSON.parse(await this.text()) as T;
    }
}