const db = require('../../database');
const ExtraExpenditurePayment = db.models.ExtraExpenditurePayment;

const ExtraExpenditureBoucherPayment= db.models.ExtraExpenditureBoucherPayment;
function update(req, res, next) {
    const data = req.body;

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
        ExtraExpenditureBoucherPayment.update(dataValue, { where: { id: dataValue.id } }).then((data) => {
                // res.json({
                //     status: true,
                //     message: 'Payment updated successfully'
                // });
                if(data){
                    ExtraExpenditurePayment.destroy({
                        where: {
                            payment_boucher_id:dataValue.id
                        }
                    }).then(datas=>{
                        if(datas){
                            return ExtraExpenditurePayment.bulkCreate(req.body.paymentData, {returning: true}).then(() => {
                                res.json({
                                    status: true,
                                    message: 'Payment updated successfully'
                                });
                            }).catch((err) => {
                                next(err);
                            })
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
