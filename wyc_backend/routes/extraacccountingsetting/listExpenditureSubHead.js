const db = require('../../database');
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;
ExtraExpenditureSubHead.belongsTo(ExtraExpenditureHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
function list(req, res, next) {
    ExtraExpenditureSubHead.findAll({
        include: [{
            model: ExtraExpenditureHead,
            as:'head',
            attributes:['name', 'id']
          }],
          where:{
            branch_id:req.query.branch_id
         }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Collection Head listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
