import React, { Component } from 'react'
import { StyleSheet, View, Image, SafeAreaView, StatusBar, Dimensions, FlatList, Text, ScrollView, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { HeaderWithBack, SkuButton, AddButton } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'

import ProductView from '../../component/ProductView'
import PromoImages from '../../component/PromoImages'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { updateCart, exitToExplore } from '../../redux/actions/AllAction';
import { addToCartHelper, updateCartHelper } from '../../utils/cart';
import Modal from '../../component/Modal'




const { height, width } = Dimensions.get('window')
class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.sharedClass = new SharedClass();
        this.productId = this.props.route.params.productId
        this.state = {
            screenHeight: height,
            loading: false,
            model: false,
            productDetails: {},
            relatedProducts: [],
            sku: {},
            showIndex: 0
        }
    }
    componentDidMount() {
        this.getProduct(this.productId)
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getProduct(this.productId)
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    getProduct = async (productId) => {
        try {

            this.setState({ loading: true })
            let response = await axios.post('user/productDetail', {
                sellerId: this.props.seller?._id,
                userId: this.props.user?._id,
                productId
            })
            this.setState({ loading: false })
            if (response && response.data.status == 200) {


                this.setState({
                    productDetails: response.data.data.productDetail,
                    sku: response.data.data.productDetail.measurementArray[0],
                    relatedProducts: response.data.data.relatedProducts
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
                console.log(data)
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

    onDetailFavirite = async (item, favType) => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })

                let response = await axios.post('user/addToWishList', { productId: item._id })
                if (response && response.data.status == 200) {
                    let product = this.state.productDetails
                    product.isFavirite = !favType
                    this.setState({ productDetails: product })
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


    onFavirite = async (item, favType) => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })

                let response = await axios.post('user/addToWishList', { productId: item._id })
                if (response && response.data.status == 200) {
                    let productItem = this.state.relatedProducts
                    let index = productItem.findIndex(value => value._id === item._id)
                    productItem[index].isFavirite = !favType
                    this.setState({ relatedProducts: productItem })

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

    selectSku = (item) => {
        let index = this.state.productDetails.measurementArray.findIndex(value => value._id === item._id)
        this.setState({
            sku: item,
            showIndex: index,
            model: false
        })

    }
    render() {
        const { loading, productDetails, sku, showIndex, model, relatedProducts } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;

        if (!Object.keys(productDetails).length) {
            return null
        }
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label="Order Details"
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

                        <View>
                            <View
                                style={{ backgroundColor: colors.white, width: width }}
                            >
                                <View style={{ height: width * .54, borderBottomWidth: .5, borderBottomColor: colors.grayColor }}>
                                    <PromoImages data={productDetails.productImages}></PromoImages>
                                    <View style={{ position: 'absolute', right: 15, top: 10 }}>
                                        <TouchableOpacity onPress={() => this.onDetailFavirite(productDetails, productDetails.isFavirite)}>
                                            <Image source={productDetails?.isFavirite ? localImages.fav_s : localImages.fav_un} style={{ height: 30, width: 30 }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            <View style={{ width: width, backgroundColor: colors.white }}>
                                <View>
                                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                                        {productDetails.productName} ({productDetails.brand})
                                    </Text>
                                    <SkuButton
                                        height={30}
                                        backgroundColor={colors.ornageButton}
                                        width={60}
                                        borderRadius={8}
                                        marginTop={10}
                                        label="Add"
                                        labelColor={colors.white}
                                        onAction={() => this.setState({
                                            model: true
                                        })}
                                        fontSize={15}
                                        data={productDetails}
                                        showIndex={showIndex}
                                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                        fontWeight={Platform.OS == 'ios' ? 'normal' : null}>

                                    </SkuButton>
                                    <View>
                                        <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                                            ₹{sku.showPrice}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                                ₹{sku.showPrice}
                                            </Text>
                                            <Text style={{ ...styles.nameText, color: colors.green }}>{sku.offerPer}% off</Text>
                                        </View>

                                    </View>
                                    <View style={{ marginBottom: 50 }}>
                                        <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>Product Description</Text>
                                        <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, }}>{productDetails.productDescription} </Text>


                                    </View>
                                </View>
                                <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                                    <AddButton
                                        height={30}
                                        backgroundColor={colors.ornageButton}
                                        width={60}
                                        borderRadius={4}
                                        marginTop={10}
                                        label="Add"
                                        labelColor={colors.white}
                                        addProduct={() => this.addToCart(productDetails, sku._id)}
                                        fontSize={15}
                                        outofStock={sku.stockAvailable == 0 || sku.status == 'Inactive'}
                                        data={this.props.cartProduct[sku._id] ? this.props.cartProduct[sku._id].quantity : 0}

                                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                        fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                                        quantityInc={() => this.updateCart(productDetails, sku._id, 1)}
                                        quantityDesc={() => this.updateCart(productDetails, sku._id, -1)}
                                    />

                                </View>
                            </View>
                            <View>

                                <Text style={[CustomStyles.textHeading]}>Related Product</Text>
                                <FlatList
                                    data={relatedProducts}
                                    scrollEnabled={true}
                                    horizontal={true}
                                    keyExtractor={item => item._id}
                                    renderItem={({ item, index }) =>
                                        <ProductView
                                            onProduct={() =>
                                                this.getProduct(item._id)
                                            }
                                            productData={item}
                                            index={index}
                                            cartItem={this.props.cartProduct}
                                            quantityInc={(measureId) => this.updateCart(item, measureId, 1)}
                                            quantityDesc={(measureId) => this.updateCart(item, measureId, -1)}
                                            addProduct={(measureId) => this.addToCart(item, measureId)}
                                            onFavirite={(favType) => this.onFavirite(item, favType, 'best')}
                                        />
                                    }
                                />
                            </View>

                            {model
                                ? <Modal
                                    headerText="Select Quentity"
                                    onSelect={(item) => this.selectSku(item)}
                                    list={productDetails.measurementArray.map(value => {
                                        return { ...value, title: value.unit + value.measurement }
                                    })}
                                    alreadySelected=""
                                    modalClose={() => this.setState({ model: false })}
                                />
                                : null}
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
export default connect(mapToProp, mapDispatchToProps)(ProductDetails)

const styles = StyleSheet.create({
    ProductView: {
        backgroundColor: '#fff',
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    categoryButton: {
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.ornageButton,
        width: (width / 3) - 30,
        marginTop: -30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameText: {
        color: colors.white,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.regular,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? 'normal' : null
    },
    mrp: {
        color: colors.white,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    }

})