import React, { Component } from 'react'
import { View, StyleSheet, SafeAreaView, StatusBar, Dimensions, Text, ScrollView, Platform } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { HeaderWithBack, ButtonWithoutShadow } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import { ProductViewMyCart } from '../../component/ProductView'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { updateCart, exitToExplore } from '../../redux/actions/AllAction';

const { height, width } = Dimensions.get('window')
class MyCartScreen extends Component {
    sharedClass = new SharedClass();

    state = {
        loading: false,
        productList: [],
    }

    componentDidMount() {
        this.getProduct()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getProduct()
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getProduct = async () => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })
                let response = await axios.get('user/getCartItem')
                this.setState({ loading: false })
                if (response && response.data.status == 200) {
                    this.setState({
                        productList: response.data.data,
                    })

                } else {
                    this.sharedClass.ShowSnakBar({
                        message: response.data.message,
                        type: 'error',
                        delay: 0
                    })
                }
                this.setState({ loading: false })
            } catch (error) {
                this.setState({ loading: false })
                console.error({ error })
            }
        } else {
            this.props.exitToExplore()
        }

    }



    updateCart = async (item, measureId, count) => {

        try {
            let cartProduct = { ...this.props.cartProduct }
            let quantity = cartProduct[measureId].quantity + count
            if (quantity < 0) {
                return
            }
            this.setState({ loading: true })

            let response = await axios.post('user/updateCart', {
                productId: item._id,
                quantity,
                productMeasurementId: measureId
            })
            if (response && response.data.status == 200) {
                this.getProduct()
                cartProduct[measureId].quantity = quantity
                if (!quantity) {
                    delete cartProduct[measureId]
                }
                this.props.updateUserCart(cartProduct)
            } else {
                this.props.updateUserCart(cartProduct)
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }

            this.setState({ loading: false })


        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }

    }
    priceCal() {
        const products = this.state.productList
        let price = 0
        for (let product of products) {
            product.productId.measurementArray.map(value => {
                if (value._id == product.productMeasurementId) {
                    price += +value.actualPrice * +product.quantity
                }
            })
        }
        return price
    }

    render() {
        const { loading, productList } = this.state
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}

                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="My Cart"
                        labelStyle={{
                            color: colors.white,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null
                        }}
                    />
                    {
                        productList.length
                            ? <><ScrollView>
                                <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginTop: 10, borderRadius: 12, }}>
                                    {
                                        productList.map((item, index) => {
                                            return (
                                                <View key={item._id}>
                                                    <ProductViewMyCart
                                                        onProduct={() => this.props.navigation.navigate('ProductDetails', {
                                                            productId: item.productId._id
                                                        })}
                                                        sku={item.productMeasurementId}
                                                        productData={item.productId} index={index}
                                                        cartItem={this.props.cartProduct}
                                                        quantityInc={(measureId) => this.updateCart(item.productId, measureId, 1)}
                                                        quantityDesc={(measureId) => this.updateCart(item.productId, measureId, -1)}
                                                        addProduct={() => { }}

                                                    />
                                                    {productList.length - 1 != index ? <View style={{ alignItems: 'center' }} >
                                                        <View style={{ width: width - 80, borderBottomWidth: .5, borderBottomColor: colors.grayColor, marginBottom: 10 }} />
                                                    </View> : null}
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </ScrollView>
                                <View style={{ width: width, backgroundColor: colors.white, height: 50, justifyContent: 'center' }}>
                                    <Text style={styles.mrp}>₹{this.priceCal()}</Text>
                                    <View style={{ position: 'absolute', right: 20 }}>
                                        <ButtonWithoutShadow
                                            height={40}
                                            backgroundColor={colors.ornageButton}
                                            width={100}
                                            borderRadius={8}
                                            labelColor={colors.white}
                                            label="Checkout"
                                            onAction={() => this.props.navigation.navigate('DeliveryOptionScreen', { price: this.priceCal() })}
                                        >

                                        </ButtonWithoutShadow>
                                    </View>
                                </View>
                            </>
                            : <Text style={{ ...CustomStyles.textLine, alignSelf: 'center', fontSize: 20 }}>No item found</Text>
                    }
                </SafeAreaView>
            </View>
        </>
    }

}
const mapToProp = state => {
    return {
        isAuth: state.auth.isAuth,
        user: state.auth.user,
        cartProduct: state.auth.cartProduct,
        seller: state.auth.seller,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateUserCart: (cartData) => {
            dispatch(updateCart(cartData))
        },
        exitToExplore: () => {
            dispatch(exitToExplore())
        }
    }
}
export default connect(mapToProp, mapDispatchToProps)(MyCartScreen)

const styles = StyleSheet.create({
    mrp: {

        // textAlign: 'center',
        color: colors.backText,
        // marginTop: 5,
        marginLeft: 30,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    }

})
