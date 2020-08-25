import request from 'request'
import {
    MATCH_MOVE_URL
} from '../config/'

export const requestPost = ({ endpoint, headers, form }) => {
    return new Promise((resolve, reject) => {
        request({
            url: MATCH_MOVE_URL + endpoint,
            method: 'POST',
            headers,
            form,
            json: true
        }, (error, responses, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })

}
export const requestPut = ({ endpoint, headers, form }) => {
    return new Promise((resolve, reject) => {
        request({
            url: MATCH_MOVE_URL + endpoint,
            method: 'PUT',
            headers,
            form,
            json: true
        }, (error, responses, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })

}
export const requestGet = ({ endpoint, headers }) => {
    return new Promise((resolve, reject) => {
        request({
            url: MATCH_MOVE_URL + endpoint,
            method: 'GET',
            headers,
            json: true
        }, (error, responses, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })
}

export const requestDelete = ({ endpoint, headers }) => {
    return new Promise((resolve, reject) => {
        request({
            url: MATCH_MOVE_URL + endpoint,
            method: 'delete',
            headers,
            json: true
        }, (error, responses, body) => {
            if (error) {
                reject(error)
            }
            resolve(body)
        })
    })
}