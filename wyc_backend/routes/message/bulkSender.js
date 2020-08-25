const async = require('async'),
 db = require('../../database');
  message = require('../../common/message'),
    commonUrl = 'http://bhashsms.com/api/sendmsg.php?user=aloksingh123&pass=123456&priority=ndnd&stype=normal&';

function bulkMsgSend(req, res, next) {
    message.getBranchMsgInfo(req.query.branch_id).then((branchInfo) => {
        if (branchInfo.sender_id) {
            let count = 0;
            async.eachSeries(req.body, (msg, cb) => {
                const url = commonUrl + 'sender=' + branchInfo.sender_id + '&phone=' + msg.mobile_no + '&text=' + msg.text;
                message.msgSender(url).then(() => {
                    count++;
                    cb();
                });
            }, (err) => {
                if (err) {
                    next();
                }
                const remaining_msg = branchInfo.remaining_msg - count,
                    msg_session_count = branchInfo.msg_session_count + count,
                    msg_date_count = branchInfo.msg_date_count + count;

                message.updateCounter(branchInfo.id, remaining_msg, msg_session_count, msg_date_count).then(() => {
                    res.json({
                        status: true,
                        message: 'Message sent successfully'
                    });
                });
            });
        } else {
            res.json({
                status: false,
                message: 'Sender id is required'
            });
        }
    });
}

module.exports = bulkMsgSend;
