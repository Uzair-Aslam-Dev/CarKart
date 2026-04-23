const multer = require('multer')
const path = require('path')
const crypto = require('crypto')


const storage = multer.diskStorage({
    destination : (req ,file , cb) => {
            cb(null , 'uploads/');

    } ,
    filename : (req , file , cb) => {
          

            const ext = path.extname(file.originalname);
            const unique = crypto.randomUUID();
            const base = path.basename(file.originalname,ext);
            const newname = `${base}-${unique}${ext}`;
            cb(null ,newname);

    }

});

const fileFilter= (req , file , cb) => {
    cb(null  , true);
}


const upload = multer({
    storage ,
    fileFilter,
    limits : {
        fileSize : 1024 * 1024 * 10 ,
        files : 5 ,
        fields : 10 ,
        fieldNameSize : 100 ,
        fieldSize : 1024 * 1024 * 1,
        headerPairs : 10 , 
        parts : 15

    }

})

module.exports = upload