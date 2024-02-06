const fsPromises = require('fs').promises;
const path = require('path');

process.on('uncaughtException', (err) => {
    console.error('There was uncought error' + err);
    process.exit(1);
});

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'starter.txt'), 'utf-8');
        console.log(data);

        await fsPromises.unlink(path.join(__dirname, 'starter.txt'));

        await fsPromises.writeFile(path.join(__dirname, 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'promiseWrite.txt'), '\n\nNice to meet you');
        await fsPromises.rename(path.join(__dirname, 'promiseWrite.txt'), path.join(__dirname, 'promiseComplete.txt'));

        const newData = await fsPromises.readFile(path.join(__dirname, 'promiseComplete.txt'), 'utf-8');
        console.log(newData);
    } catch (error) {
        console.error(error);
    }
};

fileOps();

// const myFiles = ['aha', 'oho', 'pogchamp', 'guwien', 'nota'];

// fs.readFile(path.join(__dirname, 'starter.txt'), 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

// console.log('Asynchronicznosc');

// myFiles.forEach((file) => {
//     fs.writeFile(path.join(__dirname, file), file + file + file, (err) => {
//         if (err) throw err;
//         console.log('operation complete');
//     });
// });

// calback hell example
// fs.writeFile(path.join(__dirname, 'reply.txt'), 'guwno guwno', (err) => {
//     if (err) throw err;
//     console.log('operation complete');

//     fs.appendFile(
//         path.join(__dirname, 'reply.txt'),
//         'aha \n\n\nTesting',
//         (err) => {
//             if (err) throw err;
//             console.log('operation complete');

//             fs.rename(
//                 path.join(__dirname, 'reply.txt'),
//                 path.join(__dirname, 'renamedFile.txt'),
//                 (err) => {
//                     if (err) throw err;
//                     console.log('operation complete');
//                 }
//             );
//         }
//     );
// });

// fs.appendFile(path.join(__dirname, 'test.txt'), 'Testing', (err) => {
//     if (err) throw err;
//     console.log('operation complete');
// });
