import { Transaction } from '../../models'
import mongoose from '../../db';

/*

This function takes two argument userId and amount and the check user daily limit
*/
export const dailyLoadLimit = (userId, amount) => {
    return new Promise(async (resolve, reject) => {
        let transection = await Transaction.aggregate([
            {
                $project: {
                    "fromUserId": "$fromUserId",
                    "amount": "$amount",
                    "year": { $year: "$createdAt" },
                    "month": { $month: "$createdAt" },
                    "day": { $dayOfMonth: "$createdAt" }
                }
            },
            {
                $match: {
                    "year": new Date().getFullYear(),
                    "month": new Date().getMonth() + 1,
                    "day": new Date().getDate(),
                    "fromUserId": mongoose.Types.ObjectId(userId)
                },
            },

            {
                $group: {
                    _id: "$fromUserId", total: {
                        $sum: { $toInt: "$amount" }
                    }
                }
            }
        ])

        let prevAmount = transection.length ? transection[0].total : 0;
        if ((+prevAmount + +amount) > 1000) {
            reject({ code: 400, msg: "Your daily load limit exide" })
        } else {
            resolve(transection)
        }
    })
}
/*

This function takes two argument userId and amount and the check user monthly limit
*/
export const monthlyLoadLimit = (userId, amount) => {
    return new Promise(async (resolve, reject) => {
        let transection = await Transaction.aggregate([
            {
                $project: {
                    "fromUserId": "$fromUserId",
                    "amount": "$amount",
                    "year": { $year: "$createdAt" },
                    "month": { $month: "$createdAt" },
                    "day": { $dayOfMonth: "$createdAt" }
                }
            },
            {
                $match: {
                    "year": new Date().getFullYear(),
                    "month": new Date().getMonth() + 1,
                    "fromUserId": mongoose.Types.ObjectId(userId)
                },
            },
            {
                $group: {
                    _id: "$fromUserId",
                    total: {
                        $sum: { $toInt: "$amount" }
                    }
                }
            }
        ])

        let prevAmount = transection.length ? transection[0].total : 0;
        if ((+prevAmount + +amount) > 3000) {
            reject({ code: 400, msg: "Your monthly load limit exide" })
        } else {
            resolve(transection)
        }
    })
}

/*

This function takes two argument userId and amount and the check user daily spend limit
*/
export const dailySpendLimit = (userId, amount) => {
    return new Promise(async (resolve, reject) => {
        let transection = await Transaction.aggregate([
            {
                $project: {
                    "fromUserId": "$fromUserId",
                    "type": "$type",
                    "amount": "$amount",
                    "year": { $year: "$createdAt" },
                    "month": { $month: "$createdAt" },
                    "day": { $dayOfMonth: "$createdAt" }
                }
            },
            {
                $match: {
                    "year": new Date().getFullYear(),
                    "month": new Date().getMonth() + 1,
                    "day": new Date().getDate(),
                    "fromUserId": mongoose.Types.ObjectId(userId),
                    "type": '11'
                },
            },
            {
                $group: {
                    _id: "$fromUserId",
                    total: {
                        $sum: { $toInt: "$amount" }
                    }
                }
            }
        ]);
        let spendedAmount = transection.length ? transection[0].total : 0;
        if ((+spendedAmount + +amount) > 1000) {
            reject({ code: 400, msg: "Your daily spend limit exide" })
        } else {
            resolve(transection)
        }
    })
}
/*

This function takes two argument userId and amount and the check user monthly spend limit
*/
export const yearlySpendLimit = (userId, amount) => {
    return new Promise(async (resolve, reject) => {
        let transection = await Transaction.aggregate([
            {
                $project: {
                    "fromUserId": "$fromUserId",
                    "type": "$type",
                    "amount": "$amount",
                    "year": { $year: "$createdAt" },
                    "month": { $month: "$createdAt" },
                    "day": { $dayOfMonth: "$createdAt" }
                }
            },
            {
                $match: {
                    "year": new Date().getFullYear(),
                    "fromUserId": mongoose.Types.ObjectId(userId),
                    "type": '11'
                },
            },
            {
                $group: {
                    _id: "$fromUserId",
                    total: {
                        $sum: { $toInt: "$amount" }
                    }
                }
            }
        ]);
        let spendedAmount = transection.length ? transection[0].total : 0;
        if ((+spendedAmount + +amount) > 20000) {
            reject({ code: 400, msg: "Your yearly spend limit exide" })
        } else {
            resolve(transection)
        }
    })
}

