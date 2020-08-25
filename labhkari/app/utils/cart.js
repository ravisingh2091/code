import axios from '../api'
import SharedClass from './SharedClass'

export const addToCartHelper = async ({ updateUserCart, cartProduct, item, measureId }) => {
    const sharedClass = new SharedClass()

    let response = await axios.post('user/addToCart', {
        productId: item._id,
        productMeasurementId: measureId
    })
    if (response && response.data.status == 200) {
        updateUserCart({
            ...cartProduct,
            [measureId]: {
                quantity: 1,
                productId: item._id
            }
        })

        // sharedClass.ShowSnakBar({
        //     message: response.data.message,
        //     type: 'success',
        //     delay: 0
        // })
    } else {
        sharedClass.ShowSnakBar({
            message: response.data.message,
            type: 'error',
            delay: 0
        })
    }

    // let response = await axios.post('user/addToCart', {
    //     productId: item._id,
    //     productMeasurementId: measureId
    // })
    // if (response && response.data.status == 200) {
    //     this.props.updateUserCart({
    //         ...this.props.cartProduct,
    //         [measureId]: {
    //             quantity: 1,
    //             productId: item._id
    //         }
    //     })

    //     this.sharedClass.ShowSnakBar({
    //         message: response.data.message,
    //         type: 'success',
    //         delay: 0
    //     })
    // } else {
    //     this.sharedClass.ShowSnakBar({
    //         message: response.data.message,
    //         type: 'error',
    //         delay: 0
    //     })
    // }
}

export const updateCartHelper = async ({ item, measureId, cartProduct, quantity, updateUserCart }) => {
    const sharedClass = new SharedClass()

    //api call
    let response = await axios.post('user/updateCart', {
        productId: item._id,
        quantity,
        productMeasurementId: measureId
    })
    if (response && response.data.status == 200) {
        cartProduct[measureId].quantity = quantity
        if (!quantity) {
            delete cartProduct[measureId]
        }
        updateUserCart(cartProduct)

        // sharedClass.ShowSnakBar({
        //     message: response.data.message,
        //     type: 'success',
        //     delay: 0
        // })
    } else {
        updateUserCart(cartProduct)
        sharedClass.ShowSnakBar({
            message: response.data.message,
            type: 'error',
            delay: 0
        })
    }

    // //api call
    // let response = await axios.post('user/updateCart', {
    //     productId: item._id,
    //     quantity,
    //     productMeasurementId: measureId
    // })
    // if (response && response.data.status == 200) {
    //     cartProduct[measureId].quantity = quantity
    //     if (!quantity) {
    //         delete cartProduct[measureId]
    //     }
    //     this.props.updateUserCart(cartProduct)

    //     this.sharedClass.ShowSnakBar({
    //         message: response.data.message,
    //         type: 'success',
    //         delay: 0
    //     })
    // } else {
    //     this.props.updateUserCart(cartProduct)
    //     this.sharedClass.ShowSnakBar({
    //         message: response.data.message,
    //         type: 'error',
    //         delay: 0
    //     })
    // }

}