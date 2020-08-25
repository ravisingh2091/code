import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Text, Dimensions, Platform, Image } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import AlertModel from 'react-native-modal';

import axios from '../../api'
import { HeaderWithBack, ButtonDropDown, ButtonWithoutShadow } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import DeliveryOptionStyles from '../style/DeliveryOptionStyles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Modal from '../../component/Modal'
import SharedClass from '../../utils/SharedClass'
import Loder from '../../utils/Loder'
import { updateCart, setDefaultAddress } from '../../redux/actions/AllAction'


const { width } = Dimensions.get('window')


const DeliveryOptionScreen = ({ navigation, route, updateUserCart, defaultAddress, setDefaultAddress, seller, latLong }) => {
    const sharedClass = new SharedClass()
    const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


    const [loading, setLoading] = useState(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('Select Time Slot')
    const [selectedPayMode, setSelectedPayMode] = useState('Select Payment Mode')
    const [showTimeSlot, setShowTimeSlot] = useState(false)
    const [showPaymentMode, setShowPaymentMode] = useState(false)
    const [address, setAddress] = useState({})
    const [timeSlot, setTimeSlot] = useState([])
    const [place, setPlace] = useState(false)
    const [firstTime, setFirstTime] = useState(false)
    const [deliveryCharge, setDeliveryCharge] = useState(false)
    const [pointRedeemStatus, setPoinRedeemStatus] = useState(false)
    const [points, setPoints] = useState(0)
    const [pointsApply, setPointsApply] = useState(0)
    const [actualPrice, setActualPrice] = useState(route.params.price)

    useEffect(() => {
        setAddress(defaultAddress)
        let listener = navigation.addListener('focus', () => {
            bookingSlot()
            addressList()
        })

        return listener
    }, [defaultAddress])

    const onShowModal = () => {
        setShowTimeSlot(true)
    }
    const onShowPayModal = () => {
        setShowPaymentMode(true)
    }

    const onTimeSlotSelect = (item) => {
        setSelectedTimeSlot(item.title)
        setShowTimeSlot(false)
    }
    const onPaymentMode = (item) => {
        setSelectedPayMode(item.title)
        setShowPaymentMode(false)
    }

    const getPrice = () => {
        if (firstTime) {
            return actualPrice - Math.min(actualPrice * .1, 50) + deliveryCharge
        } else {
            return actualPrice + deliveryCharge;
        }

    }

    const applyPoints = () => {
        let routerPrice = route.params.price
        setPoinRedeemStatus(!pointRedeemStatus)
        if (pointRedeemStatus) {
            setActualPrice(actualPrice + pointsApply)
        } else {
            let maxPoint = routerPrice / 2;
            let appiedPoint = Math.min(maxPoint, points)
            setPointsApply(appiedPoint)
            setActualPrice(actualPrice - appiedPoint)
        }

    }

    const addressList = async () => {
        try {
            if (!defaultAddress?._id) {
                setLoading(true)
                let response = await axios.get('user/getAddressList')
                if (response && response.data.status == 200) {
                    let address = response.data.data.find(value => value.defaultStatus == true)
                    setDefaultAddress(address)
                } else {
                    sharedClass.ShowSnakBar({
                        message: response.data.message,
                        type: 'error',
                        delay: 0
                    })
                }
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            console.error("API ERROR", { error })
        }
    }

    const bookingSlot = async () => {
        try {
            setLoading(true)
            let response = await axios.post('user/getBookingSlot', {
                sellerId: seller._id,
                totalAmount: getPrice(),
                latitude: latLong.latitude,
                longitude: latLong.longitude
            })
            if (response && response.data.status == 200) {
                let tomorrowDay = new Date(new Date().setDate(new Date().getDate() + 1)).getDay()
                let dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2)).getDay()
                let dayDayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 3)).getDay()

                let slotDay = [dayList[tomorrowDay], dayList[dayAfterTomorrow], dayList[dayDayAfterTomorrow]]

                let slotList = []
                response.data.data.slot.map(value => {
                    let index = slotDay.indexOf(value.day)
                    if (index != -1) {
                        slotList.push({
                            title: `${value.day} ${value.startSlot} - ${value.endSlot}`,
                            _id: value._id,
                            nextIndex: index
                        })
                    }
                })
                setTimeSlot(slotList)
                setFirstTime(response.data.data.firstOrderStatus)
                setDeliveryCharge(response.data.data.deliveryCharge)
                setPoints(response.data.data.points)
            } else {
                navigation.goBack();
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("API ERROR", { error })
        }
    }

    const orderPlace = async () => {

        if (!address) {
            sharedClass.ShowSnakBar({
                message: "Please select address",
                type: 'error',
                delay: 0
            })
            return
        }

        if (selectedTimeSlot == 'Select Time Slot') {
            sharedClass.ShowSnakBar({
                message: "Please select time slot",
                type: 'error',
                delay: 0
            })
            return
        }
        if (selectedPayMode == 'Select Payment Mode') {
            sharedClass.ShowSnakBar({
                message: "Please select payment mode",
                type: 'error',
                delay: 0
            })
            return
        }

        let futureday = timeSlot.find(value => value.title === selectedTimeSlot)

        let date = moment(new Date(new Date().setDate(new Date().getDate() + futureday.nextIndex))).format("YYYY-MM-DD")
        let data = {
            deliveryDate: date,
            price: getPrice(),
            totalPrice: route.params.price,
            deliveryCharges: deliveryCharge,
            redeemPoint: pointsApply,
            discountPrice: 0,
            paymentType: 0,
            addressId: address._id,
            payementId: new Date().getTime(),
            payementStatus: 'Success',
            deliverySlpot: selectedTimeSlot,
            offerType: '',
            payementDate: moment().format("YYYY-MM-DD")
        }


        try {
            setLoading(true)
            let response = await axios.post('user/orderProduct', data)
            setLoading(false)
            if (response && response.data.status == 200) {
                updateUserCart({})
                setPlace(true);
            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }

        } catch (error) {
            setLoading(false)
            console.error("API ERROR", { error })
        }
    }


    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                {showTimeSlot
                    ?
                    <Modal
                        onSelect={onTimeSlotSelect}
                        modalClose={() => setShowTimeSlot(false)}
                        list={timeSlot}
                        headerText="Select TimeSlot"
                        alreadySelected={selectedTimeSlot}
                    />
                    : null
                }

                {showPaymentMode
                    ?
                    <Modal
                        onSelect={onPaymentMode}
                        modalClose={() => setShowPaymentMode(false)}
                        list={[{
                            title: `Cash on Delivery`,
                            _id: 'cashondelivery',

                        }, {
                            title: `Pay Online`,
                            _id: 'payonline',
                            disabled: true
                        }]}
                        headerText="Select Payment Mode"
                        alreadySelected=''
                    />
                    : null
                }

                <AlertModel
                    isVisible={place}
                    onBackdropPress={() => { }}
                >
                    <View style={{
                        backgroundColor: '#f6f8f9',
                        alignItems: "center",
                        justifyContent: "space-around",
                        borderRadius: 4,
                        borderColor: "rgba(0, 0, 0, 0.1)",
                        height: 150,
                    }}>
                        <Text style={{}}>Your Order Placed Successfully</Text>
                        <ButtonWithoutShadow
                            height={40}
                            backgroundColor={colors.ornageButton}
                            width={100}
                            borderRadius={8}
                            labelColor={colors.white}
                            label="Ok"
                            onAction={() => navigation.navigate('TabStack', { screen: 'MyOrderScreen' })}
                        />
                    </View>
                </AlertModel>
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="Delivery Options"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <View style={{ ...DeliveryOptionStyles.contentView }}>
                    <View style={{ paddingHorizontal: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={DeliveryOptionStyles.nameText}>
                                {address?.name}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('AddressListScreen')}>
                                <Text style={DeliveryOptionStyles.changeAddText}>
                                    Change Address
                            </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={DeliveryOptionStyles.addressText}>
                            {address?.address}
                        </Text>
                        <Text style={DeliveryOptionStyles.phoneText}>
                            {address?.countryCode}-{address?.mobileNumber}
                        </Text>
                    </View>
                </View>
                <Text style={DeliveryOptionStyles.selectYourText}>Select Your Slot</Text>
                <View style={{ alignSelf: 'center' }}>
                    <ButtonDropDown
                        palceholder={selectedTimeSlot}
                        onAction={onShowModal}
                        buttonStyle={{
                            height: 60,
                            backgroundColor: colors.inputBoxBackground,
                            width: width - 40,
                            borderRadius: 10,
                            marginBottom: 0,
                        }}
                        placeholderStyle={{
                            color: colors.ornageButton,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null,
                            fontSize: 13,
                            marginLeft: 20,
                            marginRight: 10,
                        }}
                        containerStyle={{
                            width: width - 40,
                            borderRadius: 5
                        }}
                    />

                </View>
                <Text style={DeliveryOptionStyles.selectYourText}>Select Payment Mode</Text>
                <View style={{ alignSelf: 'center' }}>
                    <ButtonDropDown
                        palceholder={selectedPayMode}
                        onAction={onShowPayModal}
                        buttonStyle={{
                            height: 60,
                            backgroundColor: colors.inputBoxBackground,
                            width: width - 40,
                            borderRadius: 10,
                            marginBottom: 0,
                        }}
                        placeholderStyle={{
                            color: colors.ornageButton,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null,
                            fontSize: 13,
                            marginLeft: 20,
                            marginRight: 10,
                        }}
                        containerStyle={{
                            width: width - 40,
                            borderRadius: 5
                        }}
                    />
                </View>
                <View style={{ marginTop: 15, marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            backgroundColor: colors.ornageButton,
                            height: 40,
                            width: 40,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onTouchEnd={() => applyPoints()}>
                        {
                            pointRedeemStatus
                                ? <Image source={localImages.correct} style={{ width: 35, height: 35 }} />
                                : null
                        }

                    </View>
                    <Text style={{ ...CustomStyles.textLine, marginLeft: 10 }}>Redeem Your Points ({points})</Text>
                </View>
                <View style={{ marginTop: 15, marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...CustomStyles.textLine, marginLeft: 10 }}>Delivery Charge: {deliveryCharge}</Text>
                </View>

                <View style={DeliveryOptionStyles.continueView}>
                    <Text style={DeliveryOptionStyles.amount}>
                        ₹{getPrice()}
                    </Text>
                    <ButtonWithoutShadow
                        height={40}
                        backgroundColor={colors.ornageButton}
                        width={100}
                        borderRadius={8}
                        labelColor={colors.white}
                        label="CONTINUE"
                        onAction={() => orderPlace()}
                    />
                </View>
            </SafeAreaView>
        </View>
    </>
}

const mapStateToProps = state => {
    return {
        defaultAddress: state.auth.defaultAddress,
        seller: state.auth.seller,
        latLong: state.auth.latLong
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserCart: (cartData) => {
            dispatch(updateCart(cartData))
        },
        setDefaultAddress: (address) => {
            dispatch(setDefaultAddress(address))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOptionScreen)