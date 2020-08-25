const db = require('../../database');
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;

function list(req, res, next) {
    ExtraExpenditureHead.findAll({
        where:{
            branch_id:req.query.branch_id
         }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Expenditure Head listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
