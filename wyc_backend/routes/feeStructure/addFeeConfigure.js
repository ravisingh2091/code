const utils = require('../../lib/utils');
const async = require('async');
const commonSchool = require('../../common/school');
const db = require('../../database');
const FeeHead = db.models.FeeHead;
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeSchedule = db.models.FeeSchedule;

function addFeeConfigure(req, res, next) {
    const feeInfo = req.body.options;
    const feeHeadArray = feeInfo.map((fee) => { return fee.fee_head_id; });
    FeeStructureInfo.findAll({
        where: {
            session_id: req.body.session_id,
            fee_structure_id: req.body.fee_structure_id,
            fee_category_id: req.body.fee_category_id,
            fee_head_id: {
                $in: feeHeadArray
            }
        }
    }).then((structureInfo) => {
        console.log(structureInfo.length);
        if (structureInfo.length === 0) {
            commonSchool.getSessionInfo(req.body.session_id).then((sessionInfo) => {
                const session_end_date = utils.formatDate(sessionInfo.end_date);
                const today = utils.getToday();
                async.eachSeries(feeInfo, (fee, cb) => {
                    FeeStructureInfo.findOrCreate({
                        defaults: {
                            session_id: req.body.session_id,
                            fee_structure_id: req.body.fee_structure_id,
                            fee_head_id: fee.fee_head_id,
                            fee_category_id: req.body.fee_category_id,
                            amount: fee.amount,
                            first_due_date: utils.formatDate(fee.first_due_date)
                        },
                        where: {
                            session_id: req.body.session_id,
                            fee_structure_id: req.body.fee_structure_id,
                            fee_head_id: fee.fee_head_id,
                            fee_category_id: req.body.fee_category_id
                        }
                    }).then((data) => {
                        if (data[1]) {
                            return FeeHead.findOne({
                                where: { id: fee.fee_head_id }
                            }).then((feeHeadInfo) => {
                                if (feeHeadInfo.periodicity === 'Monthly' || feeHeadInfo.periodicity === 'Quarterly' || feeHeadInfo.periodicity === 'Half-Yearly') {
                                    return feeSchedule(fee.first_due_date, feeHeadInfo.periodicity, session_end_date, (scheduleData) => {
                                        async.eachSeries(scheduleData, (schedule, callBck) => {
                                            FeeSchedule.create({
                                                fee_structure_info_id: data[0].id,
                                                due_date: utils.formatDate(schedule),
                                                generate_date: today,
                                                amount: fee.amount
                                            }).then(() => {
                                                callBck();
                                            });
                                        }, (err) => {
                                            if (err) {
                                                return next(err);
                                            }
                                            cb();
                                        });
                                    });
                                } else {
                                    const first_due_date = utils.formatDate(fee.first_due_date);
                                    if (first_due_date <= session_end_date) {
                                        return FeeSchedule.create({
                                            fee_structure_info_id: data[0].id,
                                            due_date: feeHeadInfo.periodicity === 'Once' ? '2000-01-01' : first_due_date,
                                            generate_date: today,
                                            amount: fee.amount
                                        }).then(() => {
                                            cb();
                                        });
                                    } else {
                                        cb();
                                    }
                                }
                            });
                        } else {
                            cb();
                        }
                    }).catch(() => cb());
                }, (err) => {
                    if (err) {
                        next(err);
                    }
                    res.json({
                        status: true,
                        message: 'Fee Structure configure successfully'
                    });
                });
            });
        } else {
            res.json({
                status: false,
                message: 'Fee head/s already exist'
            });
        }
    });
}

function feeSchedule(due_date, periodicity, end_date, callback) {
    const scheduleData = [];
    const repeatDate = new Date(due_date);
    if (periodicity === 'Monthly') {
        for (let i = 0; i < 12; i++) {
            if (end_date >= utils.formatDate(repeatDate)) {
                scheduleData.push(new Date(repeatDate));
                repeatDate.setMonth(repeatDate.getMonth() + 1);
            }
        }
    } else if (periodicity === 'Quarterly') {
        for (let i = 0; i < 4; i++) {
            if (end_date >= utils.formatDate(repeatDate)) {
                scheduleData.push(new Date(repeatDate));
                repeatDate.setMonth(repeatDate.getMonth() + 3);
            }
        }
    } else if (periodicity === 'Half-Yearly') {
        for (let i = 0; i < 2; i++) {
            if (end_date >= utils.formatDate(repeatDate)) {
                scheduleData.push(new Date(repeatDate));
                repeatDate.setMonth(repeatDate.getMonth() + 6);
            }
        }
    }
    return callback(scheduleData);
}

module.exports = addFeeConfigure;
