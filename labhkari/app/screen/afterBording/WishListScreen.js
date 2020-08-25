import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, ScrollView, Platform, Text } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { HeaderWithDrawer } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import { ProductViewHorizontal } from '../../component/ProductView'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { updateCart, exitToExplore } from '../../redux/actions/AllAction';
import { addToCartHelper, updateCartHelper } from '../../utils/cart';

const { height, width } = Dimensions.get('window')
const WishListScreen = (props) => {
    const { isGaust, navigation, exitToExplore, cartProductData, updateUserCart } = props
    const sharedClass = new SharedClass();

    const [scrollEnabled, setScrollEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [productList, setProductList] = useState([])

    useEffect(() => {
        if (isGaust) {
            exitToExplore();
        } else {
            let listener = navigation.addListener('focus', () => {
                getProduct()
            })

            return listener
        }

    }, [])



    const onContentSizeChange = (contentWidth, contentHeight) => {
        setScrollEnabled(Platform.OS == 'ios' ? true : contentHeight > height)
    };

    const getProduct = async () => {
        try {
            setLoading(true)
            let response = await axios.get('user/getWishList')
            setLoading(false)
            if (response && response.data.status == 200) {

                setProductList(response.data.data)
            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error({ error })
        }
    }

    const addToCart = async (item, measureId) => {

        try {
            setLoading(true)

            let data = {
                updateUserCart,
                cartProduct: cartProductData,
                item,
                measureId
            }
            addToCartHelper(data)

            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.error({ error })
        }
    }

    const updateCart = async (item, measureId, count) => {
        try {
            let cartProduct = { ...cartProductData }
            let quantity = cartProduct[measureId].quantity + count
            setLoading(true)

            updateCartHelper({
                item,
                measureId,
                cartProduct,
                quantity,
                updateUserCart
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error({ error })
        }

    }

    const onFavirite = async (item) => {
        try {
            setLoading(true)
            let response = await axios.post('user/addToWishList', { productId: item._id })
            if (response && response.data.status == 200) {
                getProduct()
            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error({ error })
        }
    }




    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithDrawer
                    onActionLeft={() => navigation.openDrawer()}
                    label="Wishlist"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={CustomStyles.scrollview}
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={onContentSizeChange}
                >
                    {
                        productList.length
                            ? <View>
                                {
                                    productList.map((item, index) => {
                                        return <ProductViewHorizontal
                                            key={item.productData._id}
                                            onProduct={() => {
                                                navigation.navigate('ProductDetails', {
                                                    productId: item.productData._id
                                                })
                                            }}

                                            productData={{ ...item.productData, isFavirite: true }} index={index}
                                            cartItem={cartProductData}
                                            quantityInc={(measureId) => updateCart(item.productData, measureId, 1)}
                                            quantityDesc={(measureId) => updateCart(item.productData, measureId, -1)}
                                            addProduct={(measureId) => addToCart(item.productData, measureId)}
                                            onFavirite={() => onFavirite(item.productData)}
                                        />
                                    })
                                }

                            </View>
                            : <Text style={{ ...CustomStyles.textLine, alignSelf: 'center', fontSize: 20 }}>No data found</Text>
                    }
                </ScrollView>
            </SafeAreaView>
        </View>
    </>
}

const mapToProp = state => {
    return {
        isAuth: state.auth.isAuth,
        isGaust: state.auth.isGaust,
        user: state.auth.user,
        cartProductData: state.auth.cartProduct,
        seller: state.auth.seller,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        exitToExplore: () => {
            dispatch(exitToExplore())
        },
        updateUserCart: (cartData) => {
            dispatch(updateCart(cartData))
        },
    }
}

export default connect(mapToProp, mapDispatchToProps)(WishListScreen)