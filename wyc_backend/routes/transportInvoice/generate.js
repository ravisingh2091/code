const utils = require('../../lib/utils');
const transport = require('../../common/transport');

function generate(req, res, next) {
    const student_section_id = req.query.stu_sec_id;
    const till_date = utils.formatDate(req.query.till_date);

    transport.getStudentInvoiceInfo(student_section_id).then((studentInfo) => {
        if (studentInfo) {
            const amount = studentInfo.student.transport_type === 'Both' ? studentInfo.student.routeStop.stops.stu_both_fee : studentInfo.student.routeStop.stops.stu_one_fee;

            if (amount) {
                const schoolEnableDate = utils.formatDate(studentInfo.session.branch.transport_enable_date);

                console.log(schoolEnableDate, 'schoolEnableDate');

                const stuEnableDate = utils.formatDate(studentInfo.student.trans_enable_date);

                console.log(stuEnableDate, 'stuEnableDate');

                const firstInvoiceStartDate = schoolEnableDate > stuEnableDate ? schoolEnableDate : stuEnableDate;

                console.log(firstInvoiceStartDate, 'firstInvoiceStartDate');

                const lastInvoiceDate = utils.formatDate(studentInfo.student.trans_invoice_till_date);

                console.log(lastInvoiceDate, 'lastInvoiceDate');

                const finalInvoiceStartDate = firstInvoiceStartDate > lastInvoiceDate || lastInvoiceDate === null ? firstInvoiceStartDate : utils.addDays(lastInvoiceDate);

                console.log(finalInvoiceStartDate, 'finalInvoiceStartDate');

                return transport.getStudentTransportDiscount(student_section_id, finalInvoiceStartDate, till_date).then((discountInfo) => {
                    if (till_date > finalInvoiceStartDate || discountInfo.length > 0) {
                        return getFinalArray(till_date, finalInvoiceStartDate, discountInfo, lastInvoiceDate, (result) => {
                            const transportFee = result.monthCount * parseInt(amount);
                            res.json({
                                status: true,
                                data: {
                                    description: 'Transport Fee',
                                    amount: transportFee,
                                    form_date: finalInvoiceStartDate,
                                    to_date: till_date,
                                    route_name: studentInfo.student.routeStop.route.name,
                                    stop_name: studentInfo.student.routeStop.stops.name,
                                    due_date: utils.addDays(new Date(), studentInfo.session.branch.trans_invoice_due_date_diff),
                                    invoiceAmount: transportFee + result.discountAmount,
                                    discountInfo: result.discountData,
                                    otherInfo: studentInfo
                                }
                            });
                        });
                    } else {
                        res.json({
                            status: false,
                            message: 'Invoice already generated',
                            data: {
                                till_date: lastInvoiceDate
                            }
                        });
                    }
                });
            } else {
                res.json({
                    status: false,
                    message: 'Not yet stop amount added'
                });
            }
        } else {
            res.json({
                status: false,
                message: 'Student not allocated to transport'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = generate;

function getFinalArray(till_date, finalInvoiceStartDate, discountInfo, lastInvoiceDate, callback) {
    const discountData = [];
    let monthCount = 0;
    let discountAmount = 0;

    // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    // console.log(till_date, 'Till Date');
    // console.log(finalInvoiceStartDate, 'finalInvoiceStartDate');
    // console.log(discountInfo, 'discountInfo');

    while (till_date > finalInvoiceStartDate) {
        // console.log('*********');
        // console.log(finalInvoiceStartDate, 'Before add');
        monthCount++;
        finalInvoiceStartDate = utils.addMonthWithLastDate(finalInvoiceStartDate, lastInvoiceDate === null && monthCount === 1 ? 0 : 1);
        // console.log(finalInvoiceStartDate, 'after add');
        // console.log('*********');
    }

    if (discountInfo.length > 0) {
        discountInfo.forEach(element => {
            discountData.push({
                id: element.id,
                description: element.description,
                amount: element.amount,
                date: element.date,
                type: element.type
            });
              if(element.type === 'Discount'){
                   discountAmount = element.type === 'Discount' ? discountAmount - parseInt(element.amount) : discountAmount - parseInt(element.amount);
               }
            if(element.type === 'Penalty'){
            
              discountAmount = element.type === 'Penalty' ? discountAmount + parseInt(element.amount) : discountAmount + parseInt(element.amount);
            }
        });
    }
    return callback({ discountData, discountAmount, monthCount });
}
