// multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req: any, file: any, cb: any) {
        const dest = path.join(__dirname, '../../../assets/');
        cb(null, dest);
    },
    filename: function(req: any, file: any, cb: any) {
        console.log(file);
        console.log(req.params);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
