'use strict';

const crypto = require('crypto');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const utils = {

    /**
     * value
     */
    ACTIVE: 1,

    /**
     * value
     */
    DEACTIVE: 0,

    /**
     * User type
     */
    userType: (id) => {
        switch (id) {
            case 1:
                return 'Super Admin';
                break;
            case 2:
                return 'Admin';
                break;
            case 3:
                return 'sub Admin';
                break;
            case 4:
                return 'Teacher';
                break;
        }
    },

    /**
     * Default date Format
     */
    dateFormat: 'YYYY-MM-DD',

    /**
     * Change date format
     * @param date
     * @param format
     * @returns {*}
     */
    formatDate: (date, format = utils.dateFormat) => {
        if (!date) {
            return null;
        }
        return moment(date).format(format);
    },

    /**
     * String to MD5
     * @param password
     * @returns {*}
     */
    md5Password: (password) => {
        return `${crypto.createHash('md5').update(password.toString()).digest('hex')}`;
    },

    /**
     * check the given date is a requested day
     * @param date
     * @param day
     * @returns {boolean}
     */
    checkDay: (date, day) => {
        const dayFormat = new Date(date);
        if (dayFormat.getDay() === day) {
            return true;
        } else {
            return false;
        }
    },

    noOfDays: (startDate, endDate) => {
        const a = moment(startDate);
        const b = moment(endDate);
        return Math.abs(a.diff(b, 'days')) + 1;
    },

    toTitleCase: (str) => {
        if (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        } else {
            return null;
        }
    },

    getToday: (format = utils.dateFormat) => {
        return utils.formatDate(new Date(), format);
    },
    getMonthFirstDate: (today = new Date()) => {
        const reqDate = new Date(today);
        return utils.formatDate(new Date(reqDate.getFullYear(), reqDate.getMonth(), 1));
    },
    getMonthLastDate: (today = new Date()) => {
        const reqDate = new Date(today);
        return utils.formatDate(new Date(reqDate.getFullYear(), reqDate.getMonth() + 1, 0));
    },
    getMonth: (today = new Date()) => {
        const reqDate = new Date(today);
        return moment(reqDate).format('MMMM');
    },
    addYear: (date, noOfYear) => {
        const currentDate = new Date(date);
        return utils.formatDate(moment(currentDate).add(noOfYear, 'Y'));
    },
    addDays: (reqDate, adding_days) => {
        return moment(reqDate).add(adding_days, 'day').format('YYYY-MM-DD');
    },
    addMonth: (reqDate, noOfMonth = 1) => {
        return moment(reqDate).add(noOfMonth, 'M').format('YYYY-MM-DD');
    },
    addMonthWithLastDate: (reqDate, noOfMonth = 1) => {
        return utils.getMonthLastDate(moment(reqDate).add(noOfMonth, 'M').format('YYYY-MM-DD'));
    }
};

module.exports = utils;
