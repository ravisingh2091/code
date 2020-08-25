const commonTransport = require('../../common/transport'),
    pushNotification = require('../../common/pushNotification'),
    commonMessage = require('../../common/message'),
    commonFee = require('../../common/fee'),
    utils = require('../../lib/utils'),
    db = require('../../database');
TransportPayment = db.models.TransportPayment;

function add(req, res, next) {
    const data = req.body;
    const payment_through = data.payment_through ? data.payment_through : 'Web';

    TransportPayment.create({
        student_section_id: data.student_section_id,
        invoice_id: data.invoice_id ? data.invoice_id : null,
        first_name:data.first_name,
        last_name:data.last_name,
        amount: data.amount,
        payment_date: utils.getToday(),
        payment_mode: data.payment_mode,
        payment_through,
        description: data.description,
        collected_by:data.collected_by
    }).then((paymentInfo) => {
        return commonTransport.updateInvoiceAmount(data.student_section_id, data.amount).then(() => {
            return commonTransport.updateStuTransportDueAmount(data.student_section_id, data.amount, false, true).then(() => {
                const title = "Payment",
                msg = `Dear Parent, Fees payment of ${data.first_name} ${data.last_name} Rs. ${data.amount} has been received. Thanks for the payment. School Management.`;

                pushNotification.singleStudentPush(title, msg, data.student_section_id);
                if (payment_through === 'Mobile') {
                    commonMessage.studentMessage(data.branch_id, data.student_section_id, msg);
                    data.fee_payment_id = paymentInfo.id;
                    data.type = 'Transport';
                    return commonFee.addPaymentRelease(data).then(() => {
                        res.json({
                            status: true,
                            message: 'Transport payment successfully',
                            data: {
                                id: paymentInfo.id
                            }
                        });
                    });
                } else {
                    commonMessage.studentMessage(req.query.branch_id, data.student_section_id, msg);
                    res.json({
                        status: true,
                        message: 'Transport payment successfully',
                        data: {
                            id: paymentInfo.id
                        }
                    });
                }
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
