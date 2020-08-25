import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions, Text, ScrollView, Platform, Alert } from 'react-native'
import moment from 'moment'

import axios from '../../api'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'
import { ProductViewOrderDetails } from '../../component/ProductView'

const { height, width } = Dimensions.get('window')

class OrderDetails extends Component {
    sharedClass = new SharedClass();
    state = {
        loading: false,
        screenHeight: height,
        orderDetails: {}
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getOrder()
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    onContentSizeChange = (contentWidth, contentHeight) => {
        this.setState({ screenHeight: contentHeight });
    };

    getOrder = async () => {
        try {
            this.setState({ loading: true })
            let response = await axios.post('user/getBookingDetail', {
                bookingId: this.props.route.params.orderId
            })
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    orderDetails: response.data.data
                })

            } else {
                this.sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
        } catch (error) {
            this.setState({ loading: false })
            console.error({ error })
        }
    }
    cancelOrder = (bookingId) => {
        Alert.alert(
            'Alert',
            'Do you want to cancel?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes', onPress: async () => {
                        try {
                            this.setState({ loading: true })
                            let response = await axios.post('user/cancelOrderByUser', { bookingId })
                            this.setState({ loading: false })
                            if (response && response.data.status == 200) {
                                this.setState({ orderDetails: { ...this.state.orderDetails, orderStatus: 'Cancel' } })
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
                },
            ],
            { cancelable: false },
        );
    }

    render() {
        const scrollEnabled = Platform.OS == 'ios' ? true : this.state.screenHeight > height;
        const { loading, orderDetails } = this.state
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
                        <View style={{ ...styles.ProductView, paddingBottom: 20 }} >
                            <TouchableOpacity style={{ height: 50, justifyContent: 'center', width: width, borderBottomWidth: .5, borderBottomColor: colors.grayColor }}>
                                <Text style={{ ...styles.nameText, color: colors.grayColor, marginLeft: 10 }}>
                                    Order No.
                                    <Text style={{ ...styles.mrp, color: colors.backText, marginLeft: 10 }}>
                                        {orderDetails?.orderNumber}
                                    </Text>
                                </Text>
                                <Text style={{ ...styles.nameText, color: colors.grayColor, position: 'absolute', right: 20 }}>
                                    {moment(orderDetails.createdAt).format("MMM, Do YYYY")}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: width }}>
                                <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>Delivery Slot</Text>
                                <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>{orderDetails.deliveryDate}</Text>
                                <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>{orderDetails.deliverySlpot}</Text>

                                <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17, marginTop: 20, }}>Delivery Address</Text>
                                <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>
                                    {orderDetails.address}
                                </Text>
                                <TouchableOpacity
                                    disabled={!(orderDetails.orderStatus == "Pending" || orderDetails.orderStatus == "Accept" || orderDetails.orderStatus == "Shipped")}
                                    // onPress={() => {this.cancelOrder(orderDetails._id)}}
                                    style={{
                                        position: 'absolute', right: 20,
                                        backgroundColor: orderDetails.orderStatus === 'Cancel' ? colors.redLight : orderDetails.orderStatus === "Delivered" ? colors.greenLight : colors.red,
                                        height: 30, borderRadius: 5, width: 80, justifyContent: 'center', alignItems: 'center', marginTop: 20
                                    }}>
                                    <Text
                                        style={{
                                            ...styles.nameText,
                                            color: orderDetails.orderStatus === 'Cancel' ? colors.red : orderDetails.orderStatus === "Delivered" ? colors.green : colors.white
                                        }}
                                    >{orderDetails.orderStatus}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ ...styles.ProductView, paddingBottom: 20 }} >
                            <View style={{ width: width }}>
                                <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17, marginTop: 10 }}>Payment Details</Text>
                                <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>Payment Option</Text>
                                    <Text style={{ ...styles.nameText, color: colors.backText, fontSize: 15, position: 'absolute', right: 20 }}>Cash on Delivery</Text>
                                </View>
                                <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>Order Item</Text>
                                    <Text style={{ ...styles.nameText, color: colors.backText, fontSize: 15, position: 'absolute', right: 20 }}>{orderDetails?.orderData?.length}</Text>
                                </View>
                                <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 15 }}>Price</Text>
                                    <Text style={{ ...styles.nameText, color: colors.backText, fontSize: 15, position: 'absolute', right: 20 }}>₹{orderDetails.totalPrice}</Text>
                                </View>

                            </View>
                            <View style={{ height: 40, justifyContent: 'center', width: width, borderTopWidth: .5, borderTopColor: colors.grayColor, marginTop: 10 }}>
                                <Text style={{ ...styles.nameText, color: colors.grayColor, marginLeft: 10 }}>
                                    Order No.
                                    <Text style={{ ...styles.mrp, color: colors.backText, marginLeft: 10 }}>
                                        {orderDetails.orderNumber}
                                    </Text>
                                </Text>
                                <Text style={{ ...styles.nameText, color: colors.grayColor, position: 'absolute', right: 20 }}>
                                    {moment(orderDetails.createdAt).format("MMM, Do YYYY")}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...styles.ProductView, paddingVertical: 10, paddingHorizontal: 10 }}>
                            {orderDetails?.orderData?.map((item, index) => {
                                return (
                                    <View key={item._id}>
                                        <ProductViewOrderDetails
                                            productData={item}
                                        />
                                        {
                                            orderDetails.orderData.length - 1 != index
                                                ? <View style={{ alignItems: 'center' }} >
                                                    <View style={{ width: width - 80, borderBottomWidth: .5, borderBottomColor: colors.grayColor, marginBottom: 10 }} />
                                                </View>
                                                : null
                                        }
                                    </View>
                                )
                            }
                            )}

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    }

}

export default OrderDetails

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