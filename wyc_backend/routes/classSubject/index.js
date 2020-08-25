const verifyToken = require('../../middleware/verifyToken'),
    add = require('./add'),
    del = require('./del'),
    get = require('./get'),
    list = require('./list'),
    teacherAllSubject = require('./teacherAllSubject'),
    teacherClass = require('./teacherClass'),
    teacherSection = require('./teacherSection'),
    teacherSubject = require('./teacherSubject'),
    update = require('./update');
    teacherSubSubject = require ('./teacherSubSubject');

module.exports = (server) => {
    server.post('/v1/section/subject', verifyToken, add);
    server.delete('/v1/section/subject/:id', verifyToken, del);
    server.get('/v1/section/subject/:id', verifyToken, get);
    
    server.get('/v1/section/subject', verifyToken, list);
    server.get('/v1/teacher/all/subject', verifyToken, teacherAllSubject);
    server.get('/v1/teacher/class', verifyToken, teacherClass);
    server.get('/v1/teacher/section/:classId', verifyToken, teacherSection);
    server.get('/v1/teacher/subject/:sectionId', verifyToken, teacherSubject);
    server.get('/v1/teacher/subsubject/', verifyToken,teacherSubSubject);
    server.put('/v1/section/subject', verifyToken, update);
};
