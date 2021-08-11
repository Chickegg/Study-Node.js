let http = require('http');
let fs = require('fs');

let app = http.createServer(function(request,response){
    let _url = request.url;
    let myURL = new URL('http://localhost:3200' + _url); 
    let title = myURL.searchParams.get('id');
    console.log(myURL);
    console.log(title);
    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url.indexOf("/img/") === 0) { // picture로 시작한다면
        let imgSrc = _url.substr(1); // 이미지 파일이름 가져오기
        fs.readFile(imgSrc, (err, data) => {
            response.writeHead(200, {'Content-Type': 'image/jpeg'});
            response.end(data);
            console.log(imgSrc);
        });
        return;
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
 
    response.writeHead(200);
    fs.readFile(`data/${title}`, 'utf8', (err, description) => {
        let template = `
        <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
    </ol>
    <h2>${title}</h2>
    <p>${description}
    </p>
    </body>
    </html>
    `;
    response.end(template);
    });

});
app.listen(3200);