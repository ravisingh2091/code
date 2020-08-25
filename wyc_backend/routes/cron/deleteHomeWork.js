const sequelize = require('sequelize');
const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const Session = db.models.Session;
const Branch = db.models.Branch;
const Homework = db.models.Homework;

function deleteHomeWork(req, res, next) {


    Homework.findAll({
        attributs: ['id', [sequelize.fn('GROUP_CONCAT', sequelize.col('images')), 'asdasd']
        ],
        where: {
            session_id: 1,
            $or: [{
                images: { $ne: '' }
            }, {
                images: { $ne: null }
            }]
        },
        group: ['images']
    }).then((imageList) => {
        console.log(JSON.stringify(imageList));
    });


    // Session.findAll({
    //     attributes: ['id'],
    //     include: [{
    //         required: true,
    //         attributes: [],
    //         model: Branch,
    //         as: 'branch'
    //     }],
    //     where: { status: 'Present' }
    //     // where: { end_date: utils.addDays(new Date(), 2) }
    // }).then((sessionList) => {
    //     return async.eachSeries(sessionList, (session, callBack) => {
    //         Homework.findAll({
    //             attributs: [[sequelize.fn('GROUP_CONCAT', sequelize.col('images')), 'images']
    //             ],
    //             where: {
    //                 session_id: session.id,
    //                 $or: {
    //                     $ne: [{
    //                         images: ''
    //                     },
    //                     {
    //                         images: null
    //                     }]
    //                 }
    //             }
    //         }).then((imageList) => {
    //             console.log(JSON.stringify(imageList));
    //             return callBack();
    //         });
    //     }, () => {
    //         res.json({
    //             status: true,
    //             message: 'Homeworks deleted successfully'
    //         });
    //     });
    // }).catch((err) => {
    //     next(err);
    // });
}

module.exports = deleteHomeWork;
