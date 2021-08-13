let http = require('http');
let fs = require('fs');
// const path = require('path/posix');

let app = http.createServer(function(request,response){
    let _url = request.url;
    let myURL = new URL('http://localhost:3200' + _url); 
    let id = myURL.searchParams.get('id');
    let pathname = myURL.pathname;

    if(_url.indexOf("/img/") === 0) { // picture로 시작한다면
        let imgSrc = _url.substr(1); // 이미지 파일이름 가져오기
        fs.readFile(imgSrc, (err, data) => {
            response.writeHead(200, {'Content-Type': 'image/jpeg'});
            response.end(data);
            // console.log(imgSrc);
        });
        return;
    }

    if (pathname === '/') {
        if(id === null) {
            fs.readdir('./data/', (err, files) => {
                console.log(files);
                let id = 'Welcome';
                description = 'Hello, Node.js';
                let list = '<ul>';

                files.forEach(file => {
                    list += `<li><a href="/?id=${file}">${file}</a></li>`;
                });
                list += '</ul>';
                console.log(list);
                
                let template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${id}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${id}</h2>
                    <p>${description}</p>
                    </body>
                    </html>
                    `;
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data/', (err, files) => {
                console.log(files);
                let list = '<ul>';
                files.forEach(file => {
                    list += `<li><a href="/?id=${file}">${file}</a></li>`;
                });
                list += '</ul>';
                console.log(list);

            fs.readFile(`data/${id}`, 'utf8', (err, description) => {
                let template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${id}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${id}</h2>
                    <p>${description}
                    </p>
                    </body>
                    </html>
                    `;
                response.writeHead(200);
                response.end(template);
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3200);