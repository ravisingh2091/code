import { requestPost, requestGet, requestDelete, requestPut } from './requestApi'
import { decrypt } from './encryptDecrypt'
import { MATCH_MOVE_KEY } from '../config'

const setHeadersNotId = () => {
    return {
        "Authorization": `Basic ${MATCH_MOVE_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

const setHeaders = (id) => {
    return {
        "Authorization": `Basic ${MATCH_MOVE_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-User-ID': decrypt(id)
    }
}

export const createAccountAndWallet = (user) => {
    return new Promise(async (resolve, reject) => {

        let profileCreate = await requestPost({
            endpoint: "users",
            headers: setHeadersNotId(),
            form: {
                'email': user.email,
                'password': user.matchMovePassword,
                "first_name": user.firstName,
                "last_name": user.lastName,
                "preferred_name": user.familyName,
                'mobile_country_code': user.phone.split("-")[0].split("+")[1],
                'mobile': user.phone.split("-")[1],
            }
        })
        // console.log({ profileCreate })
        if (!profileCreate.code) {
            let walletCreate = await requestPost({
                endpoint: `users/${profileCreate.id}/wallets`,
                headers: setHeadersNotId(),
                form: {}
            })
            // console.log({ walletCreate })
            if (!walletCreate.code) {
                resolve({ walletCreate, profileCreate })
            } else {
                reject({ code: 550, msg: walletCreate.description })
            }

        } else {
            reject({ code: 550, msg: profileCreate.description })
        }

    })

}

export const processAddFundsToWalletDt = (email, amount, description) => {
    return new Promise(async (resolve, reject) => {

        let walletAddFund = await requestPost({
            endpoint: "users/wallets/funds",
            headers: setHeadersNotId(),
            form: {
                'email': email,
                'amount': amount,
                "details": {
                    'description': description
                },
            }
        })
        if (!walletAddFund.code) {
            resolve(walletAddFund)
        } else {
            reject({ code: 550, msg: walletAddFund.description })
        }
    })
}

export const processTransferFromWalletToCard = (parent, child, amount, message) => {
    return new Promise(async (resolve, reject) => {
        let cardAddFund = await requestPost({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/funds`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                'amount': amount,
                'message': message,
            }
        })
        console.log({ cardAddFund })
        if (!cardAddFund.code) {
            resolve(cardAddFund)
        } else {
            reject({ code: 550, msg: cardAddFund.description })
        }
    })
}
export const directAddFundToCard = (child, amount, message) => {
    return new Promise(async (resolve, reject) => {
        let cardAddFund = await requestPost({
            endpoint: `users/wallets/funds`,
            headers: setHeadersNotId(),
            form: {
                'load_card': true,
                'card_id': decrypt(child.matchmoveId),
                'proxy_number': decrypt(child.matchmoveCardKit),
                'amount': amount,
                'details': JSON.stringify({ message }),
            }
        })
        console.log({ cardAddFund })
        if (!cardAddFund.code) {
            resolve(cardAddFund)
        } else {
            reject({ code: 550, msg: cardAddFund.description })
        }
    })
}

export const getWalletCard = (id) => {
    return new Promise(async (resolve, reject) => {
        let walletAddFund = await requestGet({
            endpoint: `users/wallets`,
            headers: setHeaders(id)
        })
        if (!walletAddFund.code) {
            resolve(walletAddFund)
        } else {
            reject({ code: 550, msg: walletAddFund.description })
        }
    })
}

export const getCardTransaction = (parent, child, pageNo) => {
    return new Promise(async (resolve, reject) => {
        let walletAddFund = await requestGet({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/transactions/${pageNo}`,
            headers: setHeaders(parent.matchmoveId),
        })
        if (!walletAddFund.code) {
            resolve(walletAddFund)
        } else {
            reject({ code: 550, msg: walletAddFund.description })
        }
    })
}

export const parentTransactionsHistory = (parent) => {
    return new Promise(async (resolve, reject) => {
        let walletAddFund = await requestGet({
            endpoint: `users/wallets/transactions`,
            headers: setHeaders(parent.matchmoveId),
        })
        if (!walletAddFund.code) {
            resolve(walletAddFund)
        } else {
            reject({ code: 550, msg: walletAddFund.description })
        }
    })
}

export const generateCard = (parent, child, personisalizedCardId) => {
    return new Promise(async (resolve, reject) => {
        let generateCard = await requestPost({
            endpoint: `users/wallets/cards/${personisalizedCardId.code}`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                'name_on_card': child.firstName,
                '2fa_default': 1,
                '2fa_method': 'ipin',
                '2fa_value': 111111
            }
        })
        console.log({ generateCard })
        if (!generateCard.code) {
            resolve(generateCard)
        } else {
            reject({ code: 550, msg: generateCard.description })
        }
    })
}
export const generateIPIN = (parent, child, pin) => {
    return new Promise(async (resolve, reject) => {
        let generateIPin = await requestPut({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/twofactor`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                '2fa_method': 'ipin',
                '2fa_value': pin
            }
        })
        console.log({ generateIPin })
        if (!generateIPin.code) {
            resolve(generateIPin)
        } else {
            reject({ code: 550, msg: generateIPin.description })
        }
    })
}

export const addressUpdate = (parent, req) => {
    return new Promise(async (resolve, reject) => {
        let addressUpdate = await requestPut({
            endpoint: `users/addresses/billing`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                'address_1': req.address.address_1.trim(),
                'address_2': req.address.address_2.trim(),
                'city': req.address.city.trim(),
                'state': req.address.state.trim(),
                'country': req.address.country.trim(),
                'zipcode': req.address.postalCode
            }
        })
        console.log({ addressUpdate })
        if (!addressUpdate.code) {
            resolve(addressUpdate)
        } else {
            reject({ code: 550, msg: addressUpdate.description })
        }
    })
}


export const activateCard = (parent, child) => {
    return new Promise(async (resolve, reject) => {
        let activatedCard = await requestPut({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                'activation_code': decrypt(child.matchmoveActivationCode),
            }
        })
        console.log({ activatedCard })
        if (!activatedCard.code) {
            resolve(activatedCard)
        } else {
            reject({ code: 550, msg: activatedCard.description })
        }
    })
}

export const reactivateCard = (parent, child, req) => {
    return new Promise(async (resolve, reject) => {
        let reactivatedCard = await requestPost({
            endpoint: `users/wallets/cards/${child.personisalizedCardId.code}`,
            headers: setHeaders(parent.matchmoveId),
            form: {
                'id': decrypt(child.matchmoveId)
            }
        })
        if (!reactivatedCard.code) {
            resolve(reactivatedCard)
        } else {
            reject({ code: 550, msg: reactivatedCard.description })
        }
    })
}

export const lockCard = (parent, child) => {
    return new Promise(async (resolve, reject) => {
        let reactivatedCard = await requestDelete({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}`,
            headers: setHeaders(parent.matchmoveId)
        })
        if (!reactivatedCard.code) {
            resolve(reactivatedCard)
        } else {
            reject({ code: 550, msg: reactivatedCard.description })
        }
    })
}

export const createCvv = (parent, child) => {
    return new Promise(async (resolve, reject) => {
        let reactivatedCard = await requestGet({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/securities/tokens`,
            headers: setHeaders(parent.matchmoveId)
        })
        console.log({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/securities/tokens`,
            headers: setHeaders(parent.matchmoveId)
        })
        console.log({ reactivatedCard: JSON.stringify(reactivatedCard) })
        if (!reactivatedCard.code) {
            resolve(reactivatedCard)
        } else {
            reject({ code: 550, msg: reactivatedCard.description })
        }
    })
}

export const childCardBalance = (parent, child) => {
    return new Promise(async (resolve, reject) => {
        let cardBalance = await requestGet({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}`,
            headers: setHeaders(parent.matchmoveId)
        })
        console.log({ cardBalance: JSON.stringify(cardBalance) })
        if (!cardBalance.code) {
            resolve(cardBalance)
        } else {
            reject({ code: 550, msg: cardBalance.description })
        }
    })
}

export const addBalanceToSaveCategory = (parent, child, data) => {
    return new Promise(async (resolve, reject) => {
        let addBalanceToCategory = await requestPost({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/funds/categories/transfers`,
            headers: setHeaders(parent.matchmoveId),
            form: data
        })
        console.log({ addBalanceToCategory: JSON.stringify(addBalanceToCategory) })
        if (!addBalanceToCategory.code) {
            resolve(addBalanceToCategory)
        } else {
            reject({ code: 550, msg: addBalanceToCategory.description })
        }
    })
}

export const balanceTransferToWallet = (parent, child, data) => {
    return new Promise(async (resolve, reject) => {
        let balanceTransfer = await requestDelete({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}/funds?amount=${data.amount}&to_wallet=true&message=${data.message}`,
            headers: setHeaders(parent.matchmoveId),
        })
        console.log({ balanceTransfer: JSON.stringify(balanceTransfer) })
        if (!balanceTransfer.code) {
            resolve(balanceTransfer)
        } else {
            reject({ code: 550, msg: balanceTransfer.description })
        }
    })
}

export const deleteCardMM = (parent, child) => {
    return new Promise(async (resolve, reject) => {
        let cardDelete = await requestDelete({
            endpoint: `users/wallets/cards/${decrypt(child.matchmoveId)}?type=lost`,
            headers: setHeaders(parent.matchmoveId),
        })
        console.log({ cardDelete: JSON.stringify(cardDelete) })
        if (!cardDelete.code) {
            resolve(cardDelete)
        } else {
            reject({ code: 550, msg: cardDelete.description })
        }
    })
}

export const fundsDeductFormWallet = (user, amount) => {
    return new Promise(async (resolve, reject) => {
        let fundsDeduct = await requestDelete({
            endpoint: `users/wallets/funds/?email=${user.email}&amount=${amount}&details=${JSON.stringify({ pp: 'self' })}`,
            headers: setHeadersNotId(),
        })
        console.log({ fundsDeduct: JSON.stringify(fundsDeduct) })
        if (!fundsDeduct.code) {
            resolve(fundsDeduct)
        } else {
            reject({ code: 550, msg: fundsDeduct.description })
        }
    })
}

export const confirmPayment = (id) => {
    return new Promise(async (resolve, reject) => {
        let confirmDeduct = await requestDelete({
            endpoint: `oauth/consumer/funds?ids=${id}`,
            headers: setHeadersNotId(),
        })
        console.log({ confirmDeduct: JSON.stringify(confirmDeduct) })
        if (!confirmDeduct.code) {
            resolve(confirmDeduct)
        } else {
            reject({ code: 550, msg: confirmDeduct.description })
        }
    })
}