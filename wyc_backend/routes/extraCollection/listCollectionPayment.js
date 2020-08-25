const db = require('../../database');
const ExtraCollectionPayment = db.models.ExtraCollectionPayment;
const ExtraCollectionHead = db.models.ExtraCollectionHead;
//const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
ExtraCollectionPayment.belongsTo(ExtraCollectionHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
//ExtraCollectionPayment.belongsTo(ExtraExpenditureSubHead, {foreignKey: 'sub_head_id', targetKey: 'id', as:'subHead'});
const ExtraCollectionBoucherPayment= db.models.ExtraCollectionBoucherPayment;
ExtraCollectionBoucherPayment.hasMany(ExtraCollectionPayment, {foreignKey: 'payment_boucher_id', as:'payment'});
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
    ExtraCollectionBoucherPayment.findAll({
        include: [
              {
                model: ExtraCollectionPayment,
                as:'payment',
                include: [
                    {
                    model: ExtraCollectionHead,
                    as:'head',
                    attributes:['name', 'id']
                  },
                  // {
                  //   model: ExtraExpenditureSubHead,
                  //   as:'subHead',
                  //   attributes:['name', 'id']
                  // }
                ],
              },
           
        ]
       
        // where:conditions
    }).then((result) => {
        res.json({
            status: true,
            message: 'Extra Collection Payment listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
