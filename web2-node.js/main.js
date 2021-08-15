let http = require('http');
let fs = require('fs');
let qs = require('querystring');
// const path = require('path/posix');

function templateHTML(title, list, body) { // 타이틀 리스트 바디로 html전체코드를 완성하는 부분
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </html>
    `;
}
function templateList(files) { // 파일을 읽어와서 list로 만드는 부분
    let list = '<ul>';

    files.forEach(file => {
        list += `<li><a href="/?id=${file}">${file}</a></li>`;
    });
    return list += '</ul>';
}







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
                let id = 'Welcome';
                description = 'Hello, Node.js';
                let list = templateList(files);
                let template = templateHTML(id, list,`<h2>${id}</h2>
                    ${description}`);
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir('./data/', (err, files) => {
                fs.readFile(`data/${id}`, 'utf8', (err, description) => {
                    let list = templateList(files);
                    let template = templateHTML(id, list,`<h2>${id}</h2>
                        ${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else if(pathname === '/create') {
        fs.readdir('./data/', (err, files) => {
            let id = 'WEB - create';
            description = 'Hello, Node.js';
            let list = templateList(files);
            let template = templateHTML(id, list, `
            <form action="http://localhost:3200/create_process" method="post">
                <p><input type="text" name="title" placeholder="Title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p><input type="submit"></p>
            </form>
            `);
            response.writeHead(200);
            response.end(template);
        });
    } else if(pathname === '/create_process') {
        let body ='';

        request.on('data', (data) => {
            body += data; // 콜백이 실행될때마다 data를 추가한다.
        });
        // 더이상 들어오는 data가 없을 경우 request.on('end')를 호출한다.
        request.on('end', () => {
            let post = qs.parse(body); // 문자열을 객체로 변환하는 method parse
            let title = post.title;
            let description = post.description;
            console.log(title +"\n", description);
            fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
                response.end();
            })
        });
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3200);