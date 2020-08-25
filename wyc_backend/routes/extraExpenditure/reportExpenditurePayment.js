const db = require('../../database');
const ExtraExpenditurePayment = db.models.ExtraExpenditurePayment;
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;

const ExtraExpenditureBoucherPayment= db.models.ExtraExpenditureBoucherPayment;


ExtraExpenditurePayment.belongsTo(ExtraExpenditureHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
ExtraExpenditurePayment.belongsTo(ExtraExpenditureSubHead, {foreignKey: 'sub_head_id', targetKey: 'id', as:'subHead'});
ExtraExpenditurePayment.belongsTo(ExtraExpenditureBoucherPayment, {foreignKey: 'payment_boucher_id', targetKey: 'id', as:'boucher'});

ExtraExpenditureBoucherPayment.hasMany(ExtraExpenditurePayment, {foreignKey: 'payment_boucher_id', as:'payment'});
function list(req, res, next) {
   console.log(req.body)
   let headReq=[]
   let subHeadReq=[]
   let dateReq=[]
   let  consolidate=[]
   if(req.body.head_id){
    headReq.push({id:req.body.head_id})
    consolidate.push({head_id:req.body.head_id})
   }
   if(req.body.sub_head_id){
    subHeadReq.push({id:req.body.sub_head_id})
    consolidate.push({sub_head_id:req.body.sub_head_id})
   }


    // ExtraExpenditureBoucherPayment.findAll({
    //     include: [
    //           {
    //             model: ExtraExpenditurePayment,
    //             as:'payment',
    //             include: [
    //                 {
    //                 model: ExtraExpenditureHead,
    //                 as:'head',
    //                 attributes:['name', 'id'],
    //                 where:headReq
    //               },
    //               {
    //                 model: ExtraExpenditureSubHead,
    //                 as:'subHead',
    //                 attributes:['name', 'id'],
    //                 where:subHeadReq
    //               }
    //             ],
    //           },
           
    //     ]
       
    //     // where:conditions
    // }).then((result) => {
    //     res.json({
    //         status: true,
    //         message: 'Extra Expenditure Payment listed successfully',
    //         data: result
    //     });
    // }).catch((err) => {
    //     next(err);
    // });

    // ExtraExpenditureBoucherPayment.findAll({
    //   include: [
    //         {
      ExtraExpenditurePayment.findAll({
              where:consolidate,
              include: [
                  {
                  model: ExtraExpenditureHead,
                  as:'head',
                  attributes:['name', 'id'],
                  where:headReq
                },
                {
                  model: ExtraExpenditureSubHead,
                  as:'subHead',
                  attributes:['name', 'id'],
                  where:subHeadReq
                },
                {
                  model: ExtraExpenditureBoucherPayment,
                  as:'boucher',
                 // attributes:['name', 'id'],
                 // where:subHeadReq
                }
              ],
      //       },
         
      // ]
     
      // where:conditions
  }).then((result) => {
      res.json({
          status: true,
          message: 'Extra Expenditure report listed successfully',
          data: result
      });
  }).catch((err) => {
      next(err);
  });
}

module.exports = list;
