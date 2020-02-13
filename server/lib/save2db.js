module.exports = (req, res, next) =>{
    console.log('save2db is called!');
    console.log(Object.keys(req.body));
    console.log(JSON.stringify(req.body.answer));

    next();
};