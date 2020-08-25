const db = require('../../database');
const Branch = db.models.Branch;

function updateAccount(req, res, next) {
    const data = req.body;

    const updateData = {};

    if (data.type === 'Transport') {
        updateData.trans_account_name = data.account_name;
        updateData.trans_account_no = data.account_no;
        updateData.trans_ifsc = data.ifsc;
        updateData.trans_account_info = data.account_info;
        updateData.trans_merchant_id = data.merchant_id;
        updateData.trans_merchant_key = data.merchant_key;
        updateData.trans_marchant_salt = data.marchant_salt;
    }

    if (data.type === 'Fee') {
        updateData.account_name = data.account_name;
        updateData.account_no = data.account_no;
        updateData.ifsc = data.ifsc;
        updateData.account_info = data.account_info;
        updateData.merchant_id = data.merchant_id;
        updateData.merchant_key = data.merchant_key;
        updateData.marchant_salt = data.marchant_salt;
    }

    Branch.update(updateData, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Account Info Updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateAccount;
