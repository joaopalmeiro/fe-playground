const process = require('process');

// Run `node proc.js`

// More info: https://nodejs.org/api/process.html#process_process_arch
console.log(`The operating system CPU architecture is ${process.arch}.`);

// More info: https://nodejs.org/api/process.html#process_process_platform
console.log(`The operating system platform is ${process.platform}.`);
