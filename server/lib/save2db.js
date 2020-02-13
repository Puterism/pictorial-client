var db = require('../lib/db'); // imgInsert, 

module.exports = (req, res, next) =>{
    console.log('save2db is called!');
    console.log(Object.keys(req.body));
    console.log(JSON.stringify(req.body.answer));

    db.insertImg(
        req.body.name,          // 사용자 이름
        req.body.roomCode,      // 방 코드
        req.file.filename,      // 파일 이름(original 이름 아님)
        req.body.encodedImg,    // base64 형태의 image 데이터
        req.body.answer         // 정답 json
    );

    next();
};