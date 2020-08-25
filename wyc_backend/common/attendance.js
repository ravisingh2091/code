'use strict';
const sequelize = require('sequelize'),
    db = require('../database'),
    connection = db.connection,
    attendance = {
        /**
         * Get section working days
         * @param session_id
         * @param section_id
         * @returns {*}
         */
        getSectionWorkingDays: (session_id, section_id) => {
            const sqlQuery = 'SELECT DATE_FORMAT(A.date, "%M") as month_name, A.date FROM student_attendance AS A INNER JOIN student_section AS B ON(A.student_section_id = B.id) WHERE B.section_id=' + section_id + ' AND B.session_id=' + session_id + ' AND A.status NOT IN (0) GROUP BY date ORDER BY date ASC';

            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT })
                .then((workingDays) => {
                    return workingDays;
                });
        },

        /**
         * Get section attendance
         * @param section_id
         * @returns {*}
         */
        sectionAttendance: (section_id) => {
            const sqlQuery = 'SELECT A.date, A.student_section_id, DATE_FORMAT(A.date, "%M") as month_name, A.status FROM student_attendance AS A INNER JOIN student_section AS B ON A.student_section_id = B.id WHERE B.section_id=' + section_id + ' ORDER BY A.date';
            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }).then((workingDays) => {
                return workingDays;
            });
        },

        /**
         * Get student attendance
         * @param student_id
         * @returns {*}
         */
        studentAttendance: (student_id) => {
            const sqlQuery = 'SELECT date, DATE_FORMAT(date, "%M") as month_name, status FROM student_attendance WHERE student_section_id=' + student_id + ' ORDER BY date ASC';
            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT })
                .then((workingDays) => {
                    return workingDays;
                });
        }
    };

module.exports = attendance;
