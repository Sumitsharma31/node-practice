// The path module helps work with file and directory paths in a way that’s cross-platform.

const path = require('path');
const filePath = "/node-practice/phase2/pathModule";

console.log('Base name:', path.basename(filePath));  // app.js
console.log('Directory:', path.dirname(filePath));   // /users/sumit/desktop
console.log('Extension:', path.extname(filePath));   // .js

//joint path
const joinedPath = path.join('folder', 'subfolder', 'file.txt');
console.log('Joined Path:', joinedPath);


// Resolve Absolute Paths
const absolutePath = path.resolve('folder', 'subfolder', 'file.txt');
console.log('Absolute Path:', absolutePath);