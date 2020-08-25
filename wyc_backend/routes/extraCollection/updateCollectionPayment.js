const db = require('../../database');
const ExtraCollectionPayment = db.models.ExtraCollectionPayment;
const ExtraCollectionHead = db.models.ExtraCollectionHead;
//const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
ExtraCollectionPayment.belongsTo(ExtraCollectionHead, {foreignKey: 'head_id', targetKey: 'id', as:'head'});
//ExtraCollectionPayment.belongsTo(ExtraExpenditureSubHead, {foreignKey: 'sub_head_id', targetKey: 'id', as:'subHead'});
const ExtraCollectionBoucherPayment= db.models.ExtraCollectionBoucherPayment;
ExtraCollectionBoucherPayment.hasMany(ExtraCollectionPayment, {foreignKey: 'payment_boucher_id', as:'payment'});

function update(req, res, next) {
    const data = req.body;


    console.log(req.body)
    let dataValue={

    }

  
  
     if(req.body.id){
        dataValue.id=req.body.id
     }
    if(req.body.name){
        dataValue.name =req.body.name 
    }
    if(req.body.discount){
        dataValue.discount =req.body.discount 
    }

    if(req.body.edit_count){
        dataValue.edit_count =req.body.edit_count 
    }

    if(req.body.edit_discription){
        dataValue.edit_discription =req.body.edit_discription 
    }

    if(req.body.final_amount){
        dataValue.final_amount =req.body.final_amount 
    }

    if(req.body.edited_Count){
        dataValue.edited_Count =req.body.edited_Count 
    }

    if(req.body.given_by){
        dataValue.given_by =req.body.given_by 
    }

    if(req.body.total_amount){
        dataValue.total_amount =req.body.total_amount 
    }
    if(req.body.total_amount){
        dataValue.total_amount =req.body.total_amount 
    }
    // ExtraCollectionHead.findOne({
    //     where: {
    //         name: data.name,
    //         id: {
    //             $ne: data.id
    //         }
    //     }
    // }).then((head) => {
    //     if (!head) {
        ExtraCollectionBoucherPayment.update(dataValue, { where: { id: dataValue.id } }).then((data) => {
                // res.json({
                //     status: true,
                //     message: 'Payment updated successfully'
                // });
                if(data){
                    ExtraCollectionPayment.destroy({
                        where: {
                            payment_boucher_id:dataValue.id
                        }
                    }).then(datas=>{
                        if(datas){
                            return ExtraCollectionPayment.bulkCreate(req.body.items, {returning: true}).then(() => {
                                res.json({
                                    status: true,
                                    message: 'Payment updated successfully'
                                });
                            }).catch((err) => {
                                next(err);
                            })
                        }else{
                             
                            return res.json({
                                status: true,
                                message: 'Payment updated successfully'
                            }); 
                        
                    }
                    }, error=>{
                        next(error);
                    })
                   
                }
            }).catch((err) => {
                    next(err);
                });
        // res.json({
        //     status: false,
        //     message: 'Head name already exist'
        // });
    // }).catch((err) => {
    //     next(err);
    // });
}

module.exports = update;
