const fs = require('fs');

const rs = fs.createReadStream('./lorem.txt', { encoding: 'utf8' });

const ws = fs.createWriteStream('./new-lorem.txt');

// rs.on('data', (dataChunk) => {
//     ws.write(dataChunk);
//     // console.log(dataChunk);
//     // process.exit(1);
// });

rs.pipe(ws);
