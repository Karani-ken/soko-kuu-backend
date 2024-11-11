const multer = require("multer");
const s3Client = require('../Config/s3ClientConfig')
const multerS3 = require('multer-s3')
/*const storage = multer.diskStorage({
    filename: function( req, file, cb){
        cb(null, file.originalname);
    }
});*/



const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.DO_SPACES_BUCKET,
        acl: 'public-read', //set the file to be readable publicly
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname); //file key (name)
        },
    }),
});



module.exports = upload