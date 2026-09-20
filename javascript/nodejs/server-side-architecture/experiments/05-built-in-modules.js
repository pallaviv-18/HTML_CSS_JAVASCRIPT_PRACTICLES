const os = require('node:os');
const url = require('node:url');

const address = new URL('https://example.com/products?category=books');

console.log('Platform:', os.platform());
console.log('CPU count:', os.cpus().length);
console.log('Host name:', os.hostname());
console.log('Path:', address.pathname);
console.log('Category:', address.searchParams.get('category'));