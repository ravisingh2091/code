'use strict';
const async = require('async'),
    utils = require('../lib/utils'),
    commonStudent = require('../common/student'),
    db = require('../database'),
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Session = db.models.Session,
    FeeClass = db.models.FeeClass,
    FeeStructureInfo = db.models.FeeStructureInfo,
    FeeInvoice = db.models.FeeInvoice,
    FeePayment = db.models.FeePayment,
    FeeDiscount = db.models.FeeDiscount,
    FeeLate = db.models.FeeLate,
    FeeCarryForward = db.models.FeeCarryForward,
    PaymentRelease = db.models.PaymentRelease,
    fee = {
        /**
         * Get fee structure info
         * @param class_id
         * @param fee_category_id
         * @param session_id
         * @returns {*}
         */
        getFeeStructureInfo: (class_id, fee_category_id, session_id) => {
            return FeeClass.findOne({
                where: {
                    class_id,
                    session_id
                }
            }).then((structureInfo) => {
                if (structureInfo) {
                    return FeeStructureInfo.findOne({
                        where: {
                            session_id: session_id,
                            fee_structure_id: structureInfo.fee_structure_id,
                            fee_category_id
                        }
                    }).then((feeStructureInfo) => {
                        if (feeStructureInfo) {
                            return {
                                status: true,
                                structure_id: structureInfo.fee_structure_id
                            };
                        }
                        return {
                            status: false,
                            message: 'Fee Structure not created for student fee category'
                        };
                    });
                }
                return {
                    status: false,
                    message: 'Class Fee Structure not assign. Please assign Fee structure for class'
                };
            });
        },


        // getClassFeeStructure(class_id, session_id) {
        //     return FeeClass.findOne({
        //         include: [{
        //             required: true,
        //             model: FeeStructure,
        //             as: 'feeStructure'
        //         }],
        //         where: {
        //             class_id: class_id,
        //             '$feeStructure.session_id$': session_id
        //         }
        //     }).then((structureInfo) => {
        //         if (structureInfo) {
        //             return {
        //                 status: true,
        //                 structure_id: structureInfo.fee_structure_id
        //             };
        //         }
        //         return {
        //             status: false,
        //             message: 'Class Fee Structure not assigned. Please assign Fee structure for class'
        //         };
        //     });
        // },

        /**
         *
         * @param student_id
         * @param amount
         * @param to_date
         * @param payment
         * @returns {*}
         */
        updateStudentDueAmount: (student_id, amount, to_date = false, payment = false) => {
            return commonStudent.studentSectionInfo(student_id).then((studentInfo) => {
                const data = {};
                if (payment) {
                    const newAmount = studentInfo.student.payable_amount - amount;
                    data.payable_amount = newAmount;
                    data.due_amount = newAmount < 0 ? 0 : newAmount;
                } else {
                    data.due_amount = studentInfo.student.payable_amount < 0 ? 0 : studentInfo.student.payable_amount;
                    data.payable_amount = amount + studentInfo.student.payable_amount;
                    // first time update
                    if (studentInfo.student.invoice_generated_till_date === null) {
                        data.invoice_generated_till_date = to_date;
                    }
                    // todate update
                    if (to_date > utils.formatDate(studentInfo.student.invoice_generated_till_date)) {
                        data.invoice_generated_till_date = to_date;
                    }
                }
                return Student.update(data, { where: { id: studentInfo.student.id } }).then(() => {
                    return true;
                });
            });
        },

        /**
         *
         * @param student_id
         * @returns {*}
         */
        getStudentLastInvoice: (student_id) => {
            return FeeInvoice.findOne({
                where: {
                    student_section_id: student_id
                },
                order: 'generate_date DESC'
            }).then((lastInvoice) => {
                return lastInvoice;
            });
        },

        /**
         * Get branch total due amount
         * @param branch_id
         * @returns {*|Promise.<T>}
         */
        getTotalDueAmount: (branch_id) => {
            return StudentSection.sum('student.payable_amount', {
                attributes: [],
                include: [{
                    required: true,
                    attributes: [],
                    model: Session,
                    as: 'session'
                }, {
                    required: true,
                    attributes: [],
                    model: Student,
                    as: 'student'
                }],
                where: {
                    '$session.branch_id$': branch_id,
                    status: 'STUDYING'
                }
            }).then((dueAmount) => {
                return dueAmount;
            });
        },

        /**
         * Get branch today total fee collection
         * @param branch_id
         * @returns {*|Promise.<T>}
         */
        getTodayPayment: (branch_id) => {
            return FeePayment.sum('amount', {
                attributes: [],
                include: [{
                    required: true,
                    attributes: [],
                    model: StudentSection,
                    as: 'studentSection',
                    include: [{
                        required: true,
                        attributes: ['branch_id'],
                        model: Session,
                        as: 'session'
                    }]
                }],
                where: {
                    payment_date: utils.getToday(),
                    '$studentSection.session.branch_id$': branch_id
                }
            }).then((amount) => {
                return amount;
            });
        },

        /**
         * Get student fee discount for invoice generation
         * @param student_id
         * @param month
         * @returns {*}
         */
        getFeeDiscount: (student_id, month) => {
            return FeeDiscount.findAll({
                where: {
                    status: '0',
                    student_section_id: student_id,
                    date: {
                        $lte: month
                    }
                }
            }).then((result) => {
                return result;
            });
        },

        /**
         * Get fee invoice discount
         * @param invoice_id
         * @returns {*}
         */
        getInvoiceDiscount: (invoice_id) => {
            return FeeDiscount.findAll({
                where: {
                    invoice_id
                }
            }).then((discountList) => {
                return discountList;
            });
        },

        /**
         * Update student invoice unpaid amount and invoice status
         * @param student_section_id
         * @param pay_fee
         * @returns {*}
         */
        updateInvoiceAmount: (student_section_id, pay_fee) => {
            let amount = pay_fee;
            return FeeInvoice.findAll({
                where: {
                    student_section_id,
                    invoice_status: 'Open'
                },
                order: 'created_at'
            }).then((openList) => {
                if (openList.length) {
                    return async.eachSeries(openList, (invoice, callback) => {
                        if (invoice.unpaid_amount <= amount) {
                            amount = amount - invoice.unpaid_amount;
                            return FeeInvoice.update({
                                unpaid_amount: 0,
                                invoice_status: 'Close'
                            }, { where: { id: invoice.id } }).then(() => {
                                callback();
                            });
                        } else {
                            amount = invoice.unpaid_amount - amount;
                            return FeeInvoice.update({ unpaid_amount: amount }, { where: { id: invoice.id } }).then(() => {
                                callback(true);
                            });
                        }
                    }, (err) => {
                        if (err) {
                            return false;
                        }
                        return true;
                    });
                } else {
                    return true;
                }
            });
        },

        /**
         * Get student late fee for invoice generation
         * @param student_section_id
         * @returns {*}
         */
        getLateFee: (student_section_id) => {
            const whereCondition = { student_section_id, status: 0 };
            return FeeLate.findAll({
                where: whereCondition,
                order: 'created_at'
            }).then((lateFeeList) => {
                return lateFeeList;
            });
        },

        /**
         * Get Invoice late fee
         * @param added_invoice
         * @returns {*}
         */
        getInvoiceLateFee: (added_invoice) => {
            return FeeLate.findAll({ where: { added_invoice } }).then((invoiceLateFee) => {
                return invoiceLateFee;
            });
        },

        /**
         * Get session fee collection
         * @param session_id
         * @returns {Promise.<T>}
         */
        getSessionCollection: (session_id) => {
            const includeCondtion = [{ required: true, model: StudentSection, as: 'studentSection' }];

            return Promise.all([
                FeeInvoice.sum('amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id }
                }),
                FeeInvoice.sum('unpaid_amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id }
                }),
                FeePayment.sum('amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id }
                }),
                FeePayment.sum('amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id, payment_mode: 'Cash' }
                }),
                FeePayment.sum('amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id, payment_mode: 'Cheque' }
                }),
                FeePayment.sum('amount', {
                    include: includeCondtion,
                    where: { '$studentSection.session_id$': session_id, payment_mode: 'Bank Deposit' }
                }),
                FeePayment.sum('amount', {
                    include: includeCondtion,
                    where: {
                        '$studentSection.session_id$': session_id,
                        payment_mode: { $notIn: ['Cash', 'Cheque', 'Bank Deposit'] }
                    }
                })
            ]).then(([total, unpaid, paid, cashTotal, chequeTotal, bankTotal, onlineTotal]) => {
                return {
                    total: total ? total : 0,
                    unpaid: unpaid ? unpaid : 0,
                    paid: paid ? paid : 0,
                    cashTotal: cashTotal ? cashTotal : 0,
                    chequeTotal: chequeTotal ? chequeTotal : 0,
                    bankTotal: bankTotal ? bankTotal : 0,
                    onlineTotal: onlineTotal ? onlineTotal : 0
                };
            });
        },

        /**
         * Get student carry forward for invoice generation
         * @param student_section_id
         * @param status
         * @returns {*}
         */
        getStudentFeeCarryForward: (student_section_id, status) => {
            const whereCondition = { student_section_id };

            if (status) {
                whereCondition.status = status;
            }
            return FeeCarryForward.findOne({ where: whereCondition }).then((data) => {
                return data;
            });
        },

        /**
         * Get invoice carry forward
         * @param invoice_id
         * @returns {*}
         */
        getInvoiceFeeCarryForward: (invoice_id) => {
            return FeeCarryForward.findOne({ where: { invoice_id, status: '1' } }).then((data) => {
                return data;
            });
        },

        /**
         * Add carry forward
         * @param student_section_id
         * @param amount
         * @returns {*|Promise.<Instance>}
         */
        addCarryForward: (student_section_id, amount) => {
            return FeeCarryForward.findOrCreate({
                defaults: {
                    student_section_id,
                    date: utils.getToday(),
                    amount: amount
                },
                where: {
                    student_section_id
                }
            }).then((result) => {
                return result;
            });
        },

        /**
         * Update Student fee info
         * @param student_id
         * @param student_section_id
         * @param new_stu_sec_id
         * @param amount
         * @returns {Promise.<T>}
         */
        updateStuFeeInfo: (student_id, student_section_id, new_stu_sec_id, amount) => {
            return Promise.all([
                fee.addCarryForward(new_stu_sec_id, amount),
                Student.update({ payable_amount: 0, due_amount: 0 }, {
                    where: { id: student_id }
                }),
                FeeInvoice.update({ invoice_status: 'Close' }, { where: { student_section_id } })
            ]).then(() => {
                return true;
            });
        },

        /**
         * Add payment release
         */
        addPaymentRelease: (data) => {
            return PaymentRelease.create({
                fee_payment_id: data.fee_payment_id,
                merchant_key: data.merchant_key,
                merchant_id: data.merchant_id,
                merchant_transaction_id: data.merchant_transaction_id,
                total_amount: data.amount,
                aggregator_sub_transaction_id: data.aggregator_sub_transaction_id,
                type: data.type
            }).then((releaseData) => {
                return releaseData;
            });
        }
    };

module.exports = fee;
