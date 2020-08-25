const deleteHomeWork = require('./deleteHomeWork');
const holidayNotification = require('./holidayNotification');
const lateFee = require('./lateFee');
const paymentRelease = require('./paymentRelease');
const schoolInvoice = require('./schoolInvoice');
const sessionUpdate = require('./sessionUpdate');
const transportInvoice = require('./transportInvoice');

module.exports = (server) => {
    // delete past session homework and images
    server.get('/v1/cron/delete/homework', deleteHomeWork);

    // holiday before one day send notification
    server.get('/v1/holiday/notification', holidayNotification);
    
    // Auto generate late fee
    server.get('/v1/cron/late/fee', lateFee);

    // Payment Release
    server.get('/v1/cron/payment/release', paymentRelease);

    // Auto generate invoice
    server.get('/v1/cron/invoice/school', schoolInvoice);

    server.get('/v1/cron/session', sessionUpdate);

    server.get('/v1/transport/invoice/generate', transportInvoice);
};
