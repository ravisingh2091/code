const async = require('async');
const request = require('request-promise');
const utils = require('../../lib/utils');
const config = require('../../lib/config');
const db = require('../../database');
const PaymentRelease = db.models.PaymentRelease;

function paymentRelease(req, res, next) {
    const timeNow = new Date();
    const chkTime = utils.formatDate(timeNow.setHours(timeNow.getHours() - 2), 'YYYY-MM-DD HH:mm:ss');

    PaymentRelease.findAll({
        where: {
            created_at: {
                lte: chkTime
            },
            status: 'Progress'
        }
    }).then((payments) => {
        console.log();
        console.log(JSON.stringify(payments));
        console.log();
        console.log();
        if (payments) {
            return async.eachSeries(payments, (payment, callback) => {
                const finalSplitURL = `${config.splitURL}?merchantKey=${payment.merchant_key}&merchantTransactionId=${payment.merchant_transaction_id}&totalAmount=${payment.total_amount}&totalDiscount=0&jsonSplits=[{"merchantId":${payment.merchant_id},"splitAmount":${payment.total_amount},"aggregatorSubTransactionId":${payment.aggregator_sub_transaction_id},"aggregatorCharges":"0","aggregatorDiscount":"0","sellerDiscount":"0","CODAmount":"0","splitDetails":"SOME_SPLIT","amountToBeSettled":${payment.total_amount}}]`;
                const options = {
                    url: finalSplitURL,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': 'QfbJ+0OqzkEidWoexlXR0vIc3ntHcLTDHJsK4UD01O8='
                    }
                };


                console.log('***** Split REQUEST ******');
                console.log(options);
                console.log('-------------------------------');


                request(options).then((splitRes) => {
                    console.log('*****  SPLIT RESPONSE ******');
                    console.log(splitRes);
                    console.log('-------------------------------');
                    const splitData = JSON.parse(splitRes);
                    if (splitRes) {
                        const finalReleaseURL = `${config.releaseURL}?paymentId=${splitData.result.splitIdMap[payment.merchant_transaction_id]}&merchantId=${payment.merchant_id}`;
                        const releaseOptions = {
                            url: finalReleaseURL,
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': 'QfbJ+0OqzkEidWoexlXR0vIc3ntHcLTDHJsK4UD01O8='
                            }
                        };

                        console.log('*****  Release RQUERST ******');
                        console.log(releaseOptions);
                        console.log('-------------------------------');


                        request(releaseOptions).then((releaseRes) => {
                            console.log('*****  RELEASE RESPONSE ******');
                            console.log(releaseRes);
                            console.log('-------------------------------');

                            const releaseData = JSON.parse(releaseRes);


                            if (releaseData.status === 0) {
                                PaymentRelease.update({ payment_id: splitData.paymentId, status: 'Complete' }, { where: { id: payment.id } }).then(() => {
                                    callback();
                                });
                            } else {
                                PaymentRelease.update({ payment_id: splitData.paymentId }, { where: { id: payment.id } }).then(() => {
                                    callback();
                                });
                            }
                        });
                    } else {
                        callback();
                    }
                });
            }, (err) => {
                if (err) {
                    next(err);
                }
                res.json({
                    status: true,
                    message: 'Last two hours payment released successfully'
                });
            });
        }
        return res.json({
            status: false,
            message: 'No payment made during last two hours'
        });
    });
}

module.exports = paymentRelease;
