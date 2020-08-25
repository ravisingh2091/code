const verifyToken = require('../../middleware/verifyToken');
const generateRollNo = require('./generateRollNo');
const get = require('./get');
const list = require('./list');
const parentStudents = require('./parentStudents');
const promote = require('./promote');
const transfer = require('./transfer');

module.exports = (server) => {
    server.get('/v1/generate/rollno', verifyToken, generateRollNo);
    server.get('/v1/student', verifyToken, get);
    server.get('/v1/student/section', verifyToken, list);
    server.get('/v1/parent/student', verifyToken, parentStudents);
    server.put('/v1/student/promote', verifyToken, promote);
    server.put('/v1/student/transfer', verifyToken, transfer);
};
