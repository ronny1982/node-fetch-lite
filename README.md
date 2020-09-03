# node-fetch-lite

A very basic API compatible replacement for [node-fetch](https://www.npmjs.com/package/node-fetch), without leaking memory when making thousands of requests

## Sample Usage

### Perform GET
```typescript
import fetch, { Request } from 'node-fetch-lite';

(async function get() {
    const request = new Request('http://httpbin.org/json');
    const response = await fetch(request);
    const data = await response.json();
    console.log('GET / STATUS:', response.status);
    console.log('GET / CONTENT:', response.headers.get('content-type'));
    console.log('GET / DATA:', data);
})();
```

### Perform POST
```typescript
import fetch, { Request } from 'node-fetch-lite';

(async function post() {
    const request = new Request('https://httpbin.org/post', {
        method: 'POST',
        body: JSON.stringify({
            name: 'John Smith',
            age: 123
        }),
        headers: {
            'User-Agent': 'node-fetch-lite',
            'Content-Type': 'application/json'
        }
    });
    const response = await fetch(request);
    const data = await response.json();
    console.log('POST / STATUS:', response.status);
    console.log('POST / CONTENT:', response.headers.get('content-type'));
    console.log('POST / DATA:', data);
})();
```