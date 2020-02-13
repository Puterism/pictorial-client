/*
    기능 : 
        upload 콜백 함수가 만든 req.file을 base64 인코딩 후 req.body.encodedImg에 저장

    결과 :
        req.body.encodedImg 추가 

    주의 사항  : upload 콜백 함수가 호출된 이후 호출할 것. 
*/
/* module */
var fs = require('fs');           // image read, image to string,  
var path=require('path');         // make path

/* variables */
var parentPath = path.normalize(__dirname+"/..");
var imagePath = path.normalize(parentPath + "/public/images")

module.exports = (req, res, next) =>{
    console.log('img2base64 is called!');

    var imgFile = req.file; // file 객체 저장 
  
    /* 파일을 읽어 base64로 지정하고 db에 저장한다. */ 
    fs.readFile(path.join(imagePath, imgFile.filename), 'base64', (err, encodedImg)=>{
        if(err) throw err;
        req.body.encodedImg = encodedImg;

        /* // 테스트 코드. 브라우저에 해당 이미지가 출력되면 정상
        var decodedImg = Buffer.from(req.body.encodedImg, 'base64');
  
        res.writeHead(200, {
          'Content-Type': 'image/jpg',
          'Content-Length': decodedImg.length
        });
        res.end(decodedImg);
        */
        next();
    });
};