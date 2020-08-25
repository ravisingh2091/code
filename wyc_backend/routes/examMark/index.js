const verifyToken = require('../../middleware/verifyToken');
const addSupplementaryMark = require('./addSupplementaryMark');
const publish = require('./publish');
const getSubjectMarks = require('./getSubjectMarks');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/supplementary/mark', verifyToken, addSupplementaryMark);
    server.post('/v1/exam/result/publish', verifyToken, publish);
    server.get('/v1/exam/subject/marks', verifyToken, getSubjectMarks);
    server.get('/v1/exam/result', verifyToken, list);
};
