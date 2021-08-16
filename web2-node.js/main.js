let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let template = require('./lib/template.js');
let path = require('path');
let sanitizeHTML = require('sanitize-html');



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
        });
        return;
    }
    // 💥Home 부분💥
    if (pathname === '/') { 
        if(id === null) {
            fs.readdir('./data/', (err, files) => {
                let id = 'Welcome';
                description = 'Hello, Node.js';
                let list = template.list(files);
                let html = template.HTML(id, list,`<h2>${id}</h2>
                    ${description}`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data/', (err, files) => {
                let filteredId = path.parse(id).base;
                console.log(path.parse(id).base);
                fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                    let title = id;
                    let sanitizedTitle = sanitizeHTML(title);
                    let sanitizedDescription = sanitizeHTML(description, {
                        allowedTags: ['h2']
                    });
                    let list = template.list(files);
                    let html = template.HTML(id, list,`<h2>${sanitizedTitle}</h2>
                        ${sanitizedDescription}`,
                        `<a href="/create">create</a>
                         <a href="/update?id=${sanitizedTitle}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                         </form>   
                            `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create') {
        fs.readdir('./data/', (err, files) => {
            let id = 'WEB - create';
            description = 'Hello, Node.js';
            let list = template.list(files);
            let html = template.HTML(id, list, `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="Title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p><input type="submit"></p>
            </form>`,
            "");
            response.writeHead(200);
            response.end(html);
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
    } else if (pathname === '/update') {
        fs.readdir('./data/', (err, files) => {
            let filteredId = path.parse(id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                let title = id;
                let list = template.list(files);
                let html = template.HTML(id, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p><input type="submit"></p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process') {
        let body ='';

        request.on('data', (data) => {
            body += data; // 콜백이 실행될때마다 data를 추가한다.
        });
        // 더이상 들어오는 data가 없을 경우 request.on('end')를 호출한다.
        request.on('end', () => {
            let post = qs.parse(body); // 문자열을 객체로 변환하는 method parse
            let id = post.id;
            let title = post.title;
            let description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                    response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
                    response.end();
                });
            });
            console.log(post);
        }); 
    } else if(pathname === '/delete_process') {
        let body ='';

        request.on('data', (data) => {
            body += data; // 콜백이 실행될때마다 data를 추가한다.
        });
        // 더이상 들어오는 data가 없을 경우 request.on('end')를 호출한다.
        request.on('end', () => {
            let post = qs.parse(body); // 문자열을 객체로 변환하는 method parse
            let id = post.id;
            let filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, (err) => { // 삭제하는 부분
                // 삭제가 끝나면 홈으로 보내줄것이다.
                response.writeHead(302, {Location: '/'});
                response.end();
            });
            console.log(post);
        }); 
    } else {
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3200);