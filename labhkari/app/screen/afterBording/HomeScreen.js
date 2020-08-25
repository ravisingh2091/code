import React, { Component } from 'react'
import { FlatList, ScrollView, StatusBar, View, Text, SafeAreaView, Dimensions, Platform } from 'react-native'
import TextTicker from 'react-native-text-ticker'
import { getCurrentPosition } from '@react-native-community/geolocation';
import { connect } from 'react-redux'

import store from './../../redux/index'

import axios from '../../api'
import { colors, fonts } from '../../utils/constant'
import SharedClass from '../../utils/SharedClass'
import CategoryView from '../../component/CategoryView'
import ProductView from '../../component/ProductView'
import PromoImages from '../../component/PromoImages'
import { DrawerHeader } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import Loder from '../../utils/Loder'
import { updateCart, setDefaultSeller, exitToExplore, setLotLong } from '../../redux/actions/AllAction';
import { addToCartHelper, updateCartHelper } from '../../utils/cart';

const { height, width } = Dimensions.get('window');


class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.sharedClass = new SharedClass();
        this.state = {
            screenHeight: height,
            loading: false,
            categoryList: [],
            bestSellerProduct: [],
            recommededProduct: [],
            bannerList: [],
            adImage: [],
            textTicker: ''
        }
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    componentDidMount() {
        console.log({ state: store.getState().auth })
        this.getBanner()
        this.getCartData()


        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if (!this.props.seller._id) {
                getCurrentPosition(info => {
                    this.getDefaultSeller(info.coords.longitude, info.coords.latitude)
                }, error => {
                    console.log(error)
                });
            } else {
                this.getProduct()
            }
            this.getCartData()
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    getBanner = async () => {
        try {
            this.setState({ loading: true })
            let response = await axios.get('user/getBannerList')
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    bannerList: response.data.data.map(value => {
                        return { _id: value._id, image: value.bannerImage }
                    }),
                    adImage: [{
                        _id: response.data.extra?._id,
                        image: response.data.extra?.bannerImage
                    }],
                    textTicker: response.data.homeData.description
                })

            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 300
                })
            }

        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }
    }


    getDefaultSeller = async (longitude, latitude) => {
        try {

            this.setState({ loading: true })
            let response = await axios.post('user/getDefaultSeller', {
                longitude,
                latitude,
                userId: this.props.user?._id
            })
            if (response && response.data.status == 200) {
                this.props.updateDefaultSeller(response.data.data)
                this.props.setLotLong({ longitude, latitude })
                this.getProduct()
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


    getProduct = async () => {
        try {
            this.setState({ loading: true })
            let response = await axios.post('user/homeProductList', {
                sellerId: this.props.seller?._id,
                userId: this.props.user?._id
            })
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    categoryList: response.data.data.categoryList,
                    bestSellerProduct: response.data.data.bestSellerProduct,
                    recommededProduct: response.data.data.recommededProduct,
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

    getCartData = async () => {
        try {
            if (this.props.isAuth) {
                this.setState({ loading: true })
                let response = await axios.get('user/getCartItem')
                if (response && response.data.status == 200) {
                    let tempCard = {}
                    response.data.data.forEach(value => {
                        tempCard = {
                            ...tempCard,
                            [value.productMeasurementId]: {
                                quantity: value.quantity,
                                productId: value.productId._id
                            }
                        }
                    })
                    this.props.updateUserCart({
                        ...this.props.cartProduct,
                        ...tempCard
                    })

                } else {
                    this.sharedClass.ShowSnakBar({
                        message: response.data.message,
                        type: 'error',
                        delay: 0
                    })
                }
            }

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

    onFavirite = async (item, favType, type) => {
        if (this.props.isAuth) {
            try {
                this.setState({ loading: true })

                let response = await axios.post('user/addToWishList', { productId: item._id })
                if (response && response.data.status == 200) {
                    if (type == "best") {
                        let productItem = this.state.bestSellerProduct
                        let index = productItem.findIndex(value => value._id === item._id)
                        productItem[index].isFavirite = !favType
                        this.setState({ bestSellerProduct: productItem })
                    } else {
                        let productItem = this.state.recommededProduct
                        let index = productItem.findIndex(value => value._id === item._id)
                        productItem[index].isFavirite = !favType
                        this.setState({ recommededProduct: productItem })
                    }
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
        const { loading, categoryList, bestSellerProduct, recommededProduct, bannerList, adImage } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height - 50;

        let sellerCheck = <Text
            style={{
                ...CustomStyles.textLine,
                alignSelf: 'center',
                fontSize: 20
            }}>Seller not found to your location </Text>


        if (this.props.seller.providerName) {
            sellerCheck = <View>
                <View>
                    <Text style={[CustomStyles.textHeading, { marginBottom: 10 }]}>Shop By category</Text>
                    <FlatList
                        data={categoryList}
                        numColumns={3}
                        scrollEnabled={false}
                        keyExtractor={item => item._id}
                        renderItem={({ item, index }) =>
                            <CategoryView
                                styleData={{ backgroundColor: colors.ornageButton, color: colors.white }}
                                onSelectCate={() => {
                                    this.props.navigation.navigate('CategoryScreen', { categoryId: item._id, categoryName: item.categoryName })
                                }}
                                categoryData={item} index={index} />}
                    />
                </View>
                {bestSellerProduct.length ? <View>
                    <Text style={[CustomStyles.textHeading]}>Best selling product</Text>
                    <FlatList
                        data={bestSellerProduct}
                        scrollEnabled={true}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item._id}
                        renderItem={({ item, index }) =>
                            <ProductView
                                onProduct={() => this.props.navigation.navigate('ProductDetails', {
                                    productId: item._id
                                })}
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
                </View> : null}
                {recommededProduct.length ? <View>
                    <Text style={[CustomStyles.textHeading]}>Recommended product</Text>
                    <FlatList
                        data={recommededProduct}
                        scrollEnabled={true}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item._id}
                        renderItem={({ item, index }) =>
                            <ProductView
                                onProduct={() => this.props.navigation.navigate('ProductDetails', {
                                    productId: item._id
                                })}
                                productData={item} index={index}
                                cartItem={this.props.cartProduct}
                                quantityInc={(measureId) => this.updateCart(item, measureId, 1)}
                                quantityDesc={(measureId) => this.updateCart(item, measureId, -1)}
                                addProduct={(measureId) => this.addToCart(item, measureId)}
                                onFavirite={(favType) => this.onFavirite(item, favType, 'rec')}
                            />}
                    />
                </View> : null}
            </View>
        }



        return (
            <View style={CustomStyles.container}>
                <SafeAreaView style={[CustomStyles.mainContainer]}>
                    {loading && <Loder data={loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.ornageButton} />
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: colors.blueText, width: width }}>
                            <DrawerHeader
                                onActionLeft={() => this.props.navigation.openDrawer()}
                                onActionMiddle={() => this.props.navigation.navigate('VendorListingScreen')}
                                onActionRight={(type) => {
                                    if (type === 'cart') {
                                        this.props.navigation.navigate('MyCartScreen')
                                    } else {
                                        this.props.navigation.navigate('ProductSearchScreen')
                                    }
                                }}

                                label={this.props.seller.providerName}
                                labelColor={colors.white}
                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                fontWeight={Platform.OS == 'ios' ? '600' : null}
                                marginLeft={10}
                                marginRight={10}
                                labelRightColor={colors.ornageButton}
                                fontRightFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                                count={Object.keys(this.props.cartProduct).length || ''}
                            >
                            </DrawerHeader>
                            <TextTicker
                                style={[CustomStyles.textLine, CustomStyles.welcomeText, { textAlign: 'center' }]}
                                duration={10000}
                                loop
                                bounce={false}
                                repeatSpacer={50}
                                marqueeDelay={1000}
                            >
                                {this.state.textTicker}
                            </TextTicker>
                        </View>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={CustomStyles.scrollview}
                            scrollEnabled={scrollEnabled}
                            onContentSizeChange={this.onContentSizeChange}
                        >
                            <View style={[{ marginBottom: 30 }]}>
                                <View style={{ height: width * .54 }}>
                                    <PromoImages data={bannerList}></PromoImages>
                                </View>
                                <View style={{ height: width * .54 }}>
                                    <PromoImages data={adImage}></PromoImages>
                                </View>
                                {sellerCheck}

                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        );
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
        updateDefaultSeller: (sellerData) => {
            dispatch(setDefaultSeller(sellerData))
        },
        setLotLong: (latLong) => {
            dispatch(setLotLong(latLong))
        },
        exitToExplore: () => {
            dispatch(exitToExplore())
        }
    }
}
export default connect(mapToProp, mapDispatchToProps)(HomeScreen)