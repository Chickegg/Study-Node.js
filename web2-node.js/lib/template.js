module.exports = {
    HTML: function (title, list, body, control) { // 타이틀 리스트 바디로 html전체코드를 완성하는 부분
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
        </html>
        `;
    },
    list: function templateList(files) { // 파일을 읽어와서 list로 만드는 부분
        let list = '<ul>';
    
        files.forEach(file => {
            list += `<li><a href="/?id=${file}">${file}</a></li>`;
        });
        return list += '</ul>';
    }
};