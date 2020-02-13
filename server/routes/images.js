/* image upload process */
var express = require('express');
var router = express.Router();

/* module */
var path=require('path');                           // make path
var multer = require('multer');                     // Post image process
var fs = require('fs');                             // image read, image to string,  
var request = require('request');                   // for request to NCP api server
var img2base64 = require('../lib/img2base64');      // make image made by upload(multer) to base64 
var objDetect = require('../lib/objDetect');        // obj detect query
var makeAnswer = require('../lib/makeAnswer');      // make possibles and answer
var save2db= require('../lib/save2db')              // save data to database 

/* variables */
// upload version 1
/* var upload = multer({dest: './public/images'}); */
// upload version 2 // This storage determines directory and file name. 
var store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    var extension = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
  }
})
var upload = multer({storage:store});
const max_numOfimg = 2; // 이미지 최대 업로드 수

/* Routing */
/* GET post Image listing. */
router.get('/', (req, res, next)=>{
  res.send(`
    <!DOCTYPE html>
    <head>
        <title></title>
    </head>
    <body>
        <form action="/images/upload" method="post" enctype="multipart/form-data">
            <p><input type="hidden" name="name" value="kyw"></p>
            <p><input type="hidden" name="roomCode" value="1234"></p>
            <p><input type="file" name="IMG_FILE" accept="image/png, image/jpeg"></p>
            <p><input type="submit" value="submit"></p>
        </form>
    </body>
  `);
});

/* 이미지 업로드 처리 */
router.post('/upload', 
    upload.single('IMG_FILE'),  // post 방식으로 전달된 이미지 해석
    img2base64,                 // img를 base64로 변환하고 req.body.encoded에 저장
    objDetect,                  // img를 ncp object detect 서버에 보내고 결과를 돌려받아 req.body.objDetect_... 에 저장
    makeAnswer,                 // 가능한 정답과 랜덤으로 지정된 이미지의 정답 저장. req.body.possibles, req.body.answers 
    save2db,                    // 데이터 저장 부분
    (req, res, next)=>{  
        res.json({
          userName:req.body.userName,       // 이미지를 보낸 유저 이름 
          roomCode:req.body.roomCode,       // 방 고유 번호
          encodedImg:req.body.encodedImg,   // base64로 인코딩된 이미지
          answer:req.body.answer            // 랜덤으로 정한 이미지 정답
        });
}); 

router.post('/update', 
  (req, res, next)=>{
    res.send('This page is for test');
  }
); 

module.exports = router;