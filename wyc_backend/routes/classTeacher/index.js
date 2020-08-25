const verifyToken = require('../../middleware/verifyToken');
const classSections = require('./classSections');
const del = require('./del');
const delegate = require('./delegate');
const deleteDelegate = require('./deleteDelegate');
const get = require('./get');
const getDelegate = require('./getDelegate');
const getTeacherClass = require('./getTeacherClass');
const list = require('./list');
const sectionTeacher = require('./sectionTeacher');
const update = require('./update');

module.exports = (server) => {
    server.get('/v1/class/sections', verifyToken, classSections);
    server.delete('/v1/class/teacher', verifyToken, del);
    server.put('/v1/class/teacher/delegate', verifyToken, delegate);
    server.delete('/v1/class/teacher/delegate', verifyToken, deleteDelegate);
    server.get('/v1/class/teacher/info', verifyToken, get);
    server.get('/v1/class/teacher/delegate', verifyToken, getDelegate);
    server.get('/v1/class/teacher', verifyToken, getTeacherClass);
    server.get('/v1/class/teacher/list', verifyToken, list);
    server.get('/v1/section/teacher/:section_id', verifyToken, sectionTeacher);
    server.put('/v1/class/teacher', verifyToken, update);
};
