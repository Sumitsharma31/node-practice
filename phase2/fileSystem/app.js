const fs=require('fs');
//reade content of the file
fs.readFile('message.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});


//write content in the file
fs.writeFile('output.txt', 'This was written by Node.js!', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});