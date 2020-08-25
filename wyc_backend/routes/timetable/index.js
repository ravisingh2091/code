const verifyToken = require('../../middleware/verifyToken');

const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

const addPeriods = require('./addPeriods');
const getTimetable = require('./getTimetable');
const teacherTimetable = require('./teacherTimetable');
const updatePeriods = require('./updatePeriods');

module.exports = (server) => {
    server.post('/v1/timetable/name', verifyToken, add);
    server.delete('/v1/timetable', verifyToken, del);
    server.get('/v1/timetable', verifyToken, get);
    server.get('/v1/timetable/name', verifyToken, list);
    server.put('/v1/timetable/name', verifyToken, update);
    
    server.post('/v1/timetable/periods', verifyToken, addPeriods);
    server.get('/v1/timetable/periods', verifyToken, getTimetable);
    server.get('/v1/timetable/teacher', verifyToken, teacherTimetable);
    server.put('/v1/timetable/periods', verifyToken, updatePeriods);
};
