const async = require('async');
const commonTransport = require('../../common/transport');
const utils = require('../../lib/utils');
const db = require('../../database');
const TransportInvoice = db.models.TransportInvoice;
const TransportDiscount = db.models.TransportDiscount;

function add(req, res, next) {
    const data = req.body;

    TransportInvoice.create({
        student_section_id: data.student_section_id,
        description: data.description,
        amount: data.amount,
        generate_date: utils.getToday(),
        from_date: data.form_date,
        to_date: data.to_date,
        route_name: data.route_name,
        stop_name: data.stop_name,
        due_date: data.due_date,
        invoice_amount: data.invoiceAmount,
        unpaid_amount: data.invoiceAmount > 0 ? data.invoiceAmount : 0,
        status: 'Open'
    }).then((invoice) => {
        async.eachSeries(data.discountInfo, (element, callback) => {
            TransportDiscount.update({ status: '1', trans_invoice_id: invoice.id }, { where: { id: element.id } }).then(() => {
                callback();
            });
        }, (err) => {
            if (err) {
                next(err);
            }
            if (data.invoiceAmount < 0) {
                return commonTransport.updateInvoiceAmount(data.student_section_id, Math.abs(data.invoiceAmount)).then(() => {
                    return commonTransport.updateStuTransportDueAmount(data.student_section_id, data.invoiceAmount, data.to_date).then(() => {
                        res.json({
                            status: true,
                            message: 'Transport invoice generated successfully'
                        });
                    });
                });
            } else {
                commonTransport.updateStuTransportDueAmount(data.student_section_id, data.invoiceAmount, data.to_date).then(() => {
                    res.json({
                        status: true,
                        message: 'Transport invoice generated successfully'
                    });
                });
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
