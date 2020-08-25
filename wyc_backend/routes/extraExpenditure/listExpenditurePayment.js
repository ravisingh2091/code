const db = require('../../database');
const ExtraExpenditurePayment = db.models.ExtraExpenditurePayment;
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
ExtraExpenditurePayment.belongsTo(ExtraExpenditureHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
ExtraExpenditurePayment.belongsTo(ExtraExpenditureSubHead, {foreignKey: 'sub_head_id', targetKey: 'id', as:'subHead'});
const ExtraExpenditureBoucherPayment= db.models.ExtraExpenditureBoucherPayment;
ExtraExpenditureBoucherPayment.hasMany(ExtraExpenditurePayment, {foreignKey: 'payment_boucher_id', as:'payment'});
function list(req, res, next) {

    // let conditions=[]

    // if(req.body.head_id){
    //     conditions.push({head_id:req.body.head_id})
    // }

    // if(req.body.sub_head_id){
    //     conditions.push({sub_head_id:req.body.sub_head_id})
    // }

    // if(req.body.sub_head_id){
    //     conditions.push({sub_head_id:req.body.sub_head_id})
    // }
    ExtraExpenditureBoucherPayment.findAll({
        include: [
              {
                model: ExtraExpenditurePayment,
                as:'payment',
                include: [
                    {
                    model: ExtraExpenditureHead,
                    as:'head',
                    attributes:['name', 'id']
                  },
                  {
                    model: ExtraExpenditureSubHead,
                    as:'subHead',
                    attributes:['name', 'id']
                  }
                ],
              },
           
        ]
       
        // where:conditions
    }).then((result) => {
        res.json({
            status: true,
            message: 'Extra Expenditure Payment listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
