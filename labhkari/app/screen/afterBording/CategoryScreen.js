import React, { Component } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, FlatList, Text, ScrollView, Platform } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import CategoryView from '../../component/CategoryView'
import { ProductViewHorizontal } from '../../component/ProductView'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { updateCart, exitToExplore } from '../../redux/actions/AllAction';
import { addToCartHelper, updateCartHelper } from '../../utils/cart';

const { height, width } = Dimensions.get('window')


class CategoryScreen extends Component {
    sharedClass = new SharedClass();
    state = {
        screenHeight: height,
        loading: false,
        categoryList: [],
        recommededProduct: [],
    }

    componentDidMount() {
        let categoryId = this.props.route.params.categoryId
        this.getSubCategory(categoryId);
        this.getProduct()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getSubCategory(categoryId)
            this.getProduct()
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };


    getSubCategory = async (categoryId) => {
        try {
            this.setState({ loading: true })
            let response = await axios.post('user/getSubCategoryList', { categoryId })
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    categoryList: response.data.data
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

    getProduct = async () => {
        try {
            this.setState({ loading: true })
            let response = await axios.post('user/recommededProduct', {
                sellerId: this.props.seller?._id,
                userId: this.props.user?._id
            })
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    recommededProduct: response.data.data,
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

                    let productItem = this.state.recommededProduct
                    let index = productItem.findIndex(value => value._id === item._id)
                    productItem[index].isFavirite = !favType
                    this.setState({ recommededProduct: productItem })

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
        const { loading, categoryList } = this.state
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height - 50;
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={CustomStyles.mainContainer}>
                    {loading && <Loder data={loading}></Loder>}
                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <HeaderWithBack
                        onActionLeft={() => { this.props.navigation.goBack() }}
                        label={this.props.route.params.categoryName}
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
                            <Text style={[CustomStyles.textHeading, { marginBottom: 10 }]}>Shop By Sub category</Text>
                            <FlatList
                                data={categoryList}
                                numColumns={3}
                                scrollEnabled={true}
                                keyExtractor={item => item._id}
                                renderItem={({ item, index }) =>
                                    <CategoryView
                                        styleData={{ backgroundColor: colors.white, color: colors.backText }}
                                        onSelectCate={() => this.props.navigation.navigate('ProductListScreen', {
                                            subcategoryName: item.subcategoryName
                                        })}
                                        categoryData={item} index={index} />}
                            />
                        </View>
                        {this.state.recommededProduct.length ? <View>
                            <Text style={[CustomStyles.textHeading, { marginBottom: 10 }]}>Recommended product</Text>
                            {
                                this.state.recommededProduct.map((item, index) => {
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
                                        onFavirite={(favType) => this.onFavirite(item, favType, 'rec')}
                                    />
                                })
                            }
                        </View> : null}
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
export default connect(mapToProp, mapDispatchToProps)(CategoryScreen)
