const async = require('async'),
    commonFee = require('../../common/fee'),
    utils = require('../../lib/utils'),
    pushNotification = require('../../common/pushNotification'),
    db = require('../../database'),
    FeeInvoice = db.models.FeeInvoice,
    FeeInvoiceInfo = db.models.FeeInvoiceInfo,
    FeeDiscount = db.models.FeeDiscount,
    FeeLate = db.models.FeeLate,
    FeeCarryForward = db.models.FeeCarryForward;

function addInvoice(req, res, next) {
    const data = req.body;
   
    FeeInvoice.create({
        student_section_id: data.student_section_id,
        generate_date: utils.getToday(),
        from_date: data.data.from_date,
        to_date: data.data.to_date,
        due_date: data.data.due_date,
        amount: data.data.invoiceAmount,
        unpaid_amount: data.data.invoiceAmount <= 0 ? 0 : data.data.invoiceAmount,
        invoice_status: 'Open',
    }).then((invoice) => {
        return async.each(data.data.schedule, (schedule, callback) => {
            if (schedule.type === 'Schedule') {
                FeeInvoiceInfo.create({
                    invoice_id: invoice.id,
                    fee_head_id: schedule.head_id,
                    amount: schedule.amount
                }).then(() => callback());
            } else if (schedule.type === 'Late') {
                FeeLate.update({
                    status: '1',
                    added_invoice: invoice.id
                }, { where: { id: schedule.id } })
                    .then(() => callback());
            } else if (schedule.type === 'CarryForward') {
                FeeCarryForward.update({
                    status: '1',
                    invoice_id: invoice.id
                }, { where: { id: schedule.id } })
                    .then(() => callback());
            } else {
                FeeDiscount.update({
                    status: '1',
                    invoice_id: invoice.id
                }, { where: { id: schedule.id } })
                    .then(() => callback());
            }
        }, (err) => {
            if (err) {
                return next(err);
            }
            const title = 'Invoice',
                msg = 'Current month invoice generated';
            if (data.data.invoiceAmount < 0) {
                return commonFee.updateInvoiceAmount(data.student_section_id, Math.abs(data.data.invoiceAmount)).then(() => {
                    return commonFee.updateStudentDueAmount(data.student_section_id, data.data.invoiceAmount, data.data.to_date).then(() => {
                        pushNotification.singleStudentPush(title, msg, data.student_section_id);
                        res.json({
                            status: true,
                            message: 'Invoice generated successfully'
                        });
                    });
                });
            } else {
                commonFee.updateStudentDueAmount(data.student_section_id, data.data.invoiceAmount, data.data.to_date).then(() => {
                    pushNotification.singleStudentPush(title, msg, data.student_section_id);
                    res.json({
                        status: true,
                        message: 'Invoice generated successfully'
                    });
                });
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = addInvoice;
