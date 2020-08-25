const commonFee = require('../../common/fee'),
    pushNotification = require('../../common/pushNotification'),
    commonMessage = require('../../common/message'),
    utils = require('../../lib/utils'),
    db = require('../../database'),
    FeePayment = db.models.FeePayment;

function add(req, res, next) {
    const data = req.body,
        payment_through = data.payment_through ? data.payment_through : 'Web';

    FeePayment.create({
        student_section_id: data.student_section_id,
        invoice_id: data.invoice_id ? data.invoice_id : null,
        first_name:data.first_name,
        last_name:data.last_name,
        amount: data.amount,
        payment_date: utils.getToday(),
        payment_mode: data.payment_mode,
        payment_through,
        description: data.description,
        collected_by: data.collected_by
    }).then((payment) => {
        return commonFee.updateInvoiceAmount(data.student_section_id, data.amount).then(() => {
            return commonFee.updateStudentDueAmount(data.student_section_id, data.amount, false, true).then(() => {
                const title = "Payment",
                    msg = `Dear Parent, Fees payment ${data.first_name} ${data.last_name} of Rs. ${data.amount} has been received. Thanks for the payment. School Management.`;

                pushNotification.singleStudentPush(title, msg, data.student_section_id);
                if (payment_through === 'Mobile') {
                    data.fee_payment_id = payment.id;
                    data.type = 'Fee';
                    return commonFee.addPaymentRelease(data).then(() => {
                        commonMessage.studentMessage(data.branch_id, data.student_section_id, msg);
                        res.json({
                            status: true,
                            message: 'Payment successfully',
                            data: {
                                payment_id: payment.id
                            }
                        });
                    });
                } else {
                    commonMessage.studentMessage(req.query.branch_id, data.student_section_id, msg);
                    res.json({
                        status: true,
                        message: 'Payment successfully',
                        data: {
                            payment_id: payment.id
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
