import React, { Component } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, Text, ScrollView, Platform, TextInput } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import Button, { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import { ProductViewHorizontal } from '../../component/ProductView'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { updateCart, exitToExplore } from '../../redux/actions/AllAction';
import { addToCartHelper, updateCartHelper } from '../../utils/cart';


const { height, width } = Dimensions.get('window')
class ProductSearchScreen extends Component {
    sharedClass = new SharedClass();

    state = {
        screenHeight: height,
        loading: false,
        value: '',
        productList: [],
    }

    componentDidMount() {

    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    getProduct = async () => {

        if (this.state.value) {
            try {
                this.setState({ loading: true })
                let response = await axios.post('user/productListBySearch', {
                    sellerId: this.props.seller?._id,
                    search: this.state.value,
                })
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
        }

    }

    addToCart = async (item, measureId) => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })

                let data = {
                    updateUserCart: this.props.updateUserCart,
                    cartProduct: this.props.cartProduct,
                    item,
                    measureId
                }
                addToCartHelper(data)

                this.setState({ loading: false })

            } catch (error) {
                this.setState({ loading: false })
                console.error({ error })
            }
        } else {
            this.props.updateUserCart({
                ...this.props.cartProduct,
                [measureId]: {
                    quantity: 1,
                    productId: item._id
                }
            })
        }
    }

    updateCart = async (item, measureId, count) => {
        try {
            let cartProduct = { ...this.props.cartProduct }
            let quantity = cartProduct[measureId].quantity + count
            if (this.props.isAuth) {
                this.setState({ loading: true })

                updateCartHelper({
                    item,
                    measureId,
                    cartProduct,
                    quantity,
                    updateUserCart: this.props.updateUserCart
                })
                this.setState({ loading: false })
            } else {
                cartProduct[measureId].quantity = quantity
                if (!quantity) {
                    delete cartProduct[measureId]
                }
                this.props.updateUserCart(cartProduct)

            }
        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }

    }

    onFavirite = async (item, favType) => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })

                let response = await axios.post('user/addToWishList', { productId: item._id })
                if (response && response.data.status == 200) {
                    let productItem = this.state.productList
                    let index = productItem.findIndex(value => value._id === item._id)
                    productItem[index].isFavirite = !favType
                    this.setState({ productList: productItem })
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
            this.props.exitToExplore();
        }

    }

    render() {
        const { loading, value } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="Search Product"
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
                        onContentSizeChange={this.onContentSizeChange}
                    >
                        <View style={{ margin: 15, backgroundColor: colors.inputBox }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    placeholder="Search Product"
                                    value={value}
                                    // autoFocus={true}
                                    onChangeText={(text) => this.setState({ value: text })}
                                    style={{
                                        width: width - 100
                                    }}>
                                </TextInput>
                                <Button
                                    height={50}
                                    backgroundColor={colors.ornageButton}
                                    width={70}
                                    borderRadius={8}
                                    marginTop={0}
                                    label="Search"
                                    labelColor={colors.inputBox}
                                    onAction={() => this.getProduct()}
                                    fontSize={17}
                                    fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}

                                    fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                    fontWeight={Platform.OS == 'ios' ? '700' : null}
                                />
                            </View>


                        </View>
                        <View>
                            {
                                this.state.productList.map((item, index) => {
                                    return <ProductViewHorizontal
                                        key={item._id}
                                        onProduct={() => this.props.navigation.navigate('ProductDetails', {
                                            productId: item._id
                                        })}
                                        productData={item} index={index}
                                        cartItem={this.props.cartProduct}
                                        quantityInc={(measureId) => this.updateCart(item, measureId, 1)}
                                        quantityDesc={(measureId) => this.updateCart(item, measureId, -1)}
                                        addProduct={(measureId) => this.addToCart(item, measureId)}
                                        onFavirite={(favType) => this.onFavirite(item, favType)}
                                    />
                                })
                            }
                        </View>
                    </ScrollView>
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
export default connect(mapToProp, mapDispatchToProps)(ProductSearchScreen)
