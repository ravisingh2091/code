const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');
const list = require('./list');
const teacherHomework = require('./teacherHomework');
const sectionHomework = require('./sectionHomework');


const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/homework/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname);
    }
});

const multerupload = multer({ storage: storage });

module.exports = (server) => {
    server.post('/v1/homework', multerupload.any(), verifyToken, add);
    server.get('/v1/section/homework/:sectionId', verifyToken, list);
    server.get('/v1/student/homework', verifyToken, get);
    server.get('/v1/section/homework', verifyToken, sectionHomework);
    server.get('/v1/teacher/homework', verifyToken, teacherHomework);
};
