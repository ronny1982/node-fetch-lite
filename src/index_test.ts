import fetch, { Request } from './index';

describe('fetch', () => {

    it('Should throw when host not exist', async () => {
        const request = new Request('http://c4e19e69dc0bdba0d9a64c948433a8e4e2ba848b');
        await expect(fetch(request)).rejects.toThrowError('getaddrinfo ENOTFOUND c4e19e69dc0bdba0d9a64c948433a8e4e2ba848b');
    });

    it('Should support http & https protocols', async () => {
        for(let protocol of ['http:', 'https:']) {
            const request = new Request(protocol + '//httpbin.org/get');
            const response = await fetch(request);
            expect(response.status).toBe(200);
        }
    });

    it('Should not throw on 4xx or 5xx status', async () => {
        for(let status of [400, 403, 404, 500, 502]) {
            const request = new Request('http://httpbin.org/status/' + status);
            const response = await fetch(request);
            expect(response.status).toBe(status);
        }
    });

    // TODO: https://github.com/node-fetch/node-fetch/blob/64c5c296a0250b852010746c76144cb9e14698d9/src/index.js#L232
    it('Should support gzip', async () => {
        const request = new Request('https://httpbin.org/gzip');
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-encoding')).toBe('gzip');
        expect(data.gzipped).toBe(true);
    });

    // TODO: https://github.com/node-fetch/node-fetch/blob/64c5c296a0250b852010746c76144cb9e14698d9/src/index.js#L267
    it('Should support brotli', async () => {
        const request = new Request('https://httpbin.org/brotli');
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-encoding')).toBe('brotli');
        expect(data.brotli).toBe(true);
    });

    // TODO: https://github.com/node-fetch/node-fetch/blob/64c5c296a0250b852010746c76144cb9e14698d9/src/index.js#L242
    it('Should support deflate', async () => {
        const request = new Request('https://httpbin.org/deflate');
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-encoding')).toBe('deflate');
        expect(data.deflated).toBe(true);
    });

    it('Should support case insensitive headers', async () => {
        const request = new Request('https://httpbin.org/headers');
        const response = await fetch(request);
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        expect(response.headers.get('content-type')).toBe('application/json');
    });

    it('Should send correct headers', async () => {
        const request = new Request('https://httpbin.org/headers', {
            headers: {
                'User-Agent': 'node-fetch-lite',
                'x-custom-header': 'c4e19e69dc0bdba0d9a64c948433a8e4e2ba848b',
            }
        });
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.headers['User-Agent']).toBe('node-fetch-lite');
        expect(data.headers['X-Custom-Header']).toBe('c4e19e69dc0bdba0d9a64c948433a8e4e2ba848b');
    });

    it('Should receive binary image data', async () => {
        const request = new Request('https://httpbin.org/image/png');
        const response = await fetch(request);
        const data = await response.arrayBuffer();
        expect(response.status).toBe(200);
        expect(parseInt(response.headers.get('content-length'))).toBe(data.byteLength);
        expect(response.headers.get('content-type')).toBe('image/png');
        expect(Buffer.from(data.slice(1, 4)).toString('utf8')).toBe('PNG');
    });

    it('Should receive text data', async () => {
        const request = new Request('https://httpbin.org/deny');
        const response = await fetch(request);
        const data = await response.text();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-Type')).toBe('text/plain');
        expect(data).toContain(`YOU SHOULDN'T BE HERE`);
    });

    it('Should receive json data', async () => {
        interface Presentation { slideshow: { title: string } };
        const request = new Request('https://httpbin.org/json');
        const response = await fetch(request);
        const data = await response.json<Presentation>();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-Type')).toBe('application/json');
        expect(data.slideshow.title).toBe('Sample Slide Show');
    });

    it('Should send text data', async () => {
        const request = new Request('https://httpbin.org/post', {
            method: 'POST',
            body: 'id;name\n123;John Smith'
        });
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.data).toBe('id;name\n123;John Smith');
        expect(data.form).toStrictEqual({});
        expect(data.json).toStrictEqual(null);
        expect(data.headers['Content-Type']).toBe(undefined);
    });

    it('Should send form data', async () => {
        const request = new Request('https://httpbin.org/post', {
            method: 'POST',
            body: 'id=123&name=John+Smith',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.form.id).toBe('123');
        expect(data.form.name).toBe('John Smith');
        expect(data.json).toStrictEqual(null);
        expect(data.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    });

    it('Should send json data', async () => {
        const request = new Request('https://httpbin.org/post', {
            method: 'POST',
            body: JSON.stringify({
                id: 123,
                name: 'John Smith'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await fetch(request);
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.json.id).toBe(123);
        expect(data.json.name).toBe('John Smith');
        expect(data.form).toStrictEqual({});
        expect(data.headers['Content-Type']).toBe('application/json');
    });

    // TODO: redirection ...
});