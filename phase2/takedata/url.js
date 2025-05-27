//URLSearchParams in node--

const { URLSearchParams } = require('url');
const params = new URLSearchParams('name=Sumit&gender=male');
console.log(params.get('name')); // 
