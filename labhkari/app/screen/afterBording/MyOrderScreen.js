import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, ScrollView, Platform, Text, Alert } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { exitToExplore } from './../../redux/actions/AllAction'
import { HeaderWithDrawer } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import { OrderHistory } from '../../component/ProductView'
import SharedClass from '../../utils/SharedClass'
import Loder from '../../utils/Loder'



const MyOrderScreen = (props) => {
    const { isGaust, navigation, exitToExplore } = props
    const sharedClass = new SharedClass()
    const [loading, setLoading] = useState(false)
    const [productList, setProductList] = useState([])


    useEffect(() => {
        if (isGaust) {
            exitToExplore();
        } else {
            let listener = navigation.addListener('focus', () => {
                orderList()
            })
            return listener
        }



    }, [])


    const orderList = async () => {
        try {
            setLoading(true)
            let response = await axios.get('user/getOrderList')
            setLoading(false)
            if (response && response.data.status == 200) {
                setProductList(response.data.data)
            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 300
                })
            }

        } catch (error) {
            setLoading(false)
            console.error("API ERROR", { error })
        }
    }
    const cancelOrder = (bookingId, index) => {
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
                            setLoading(true)
                            let response = await axios.post('user/cancelOrderByUser', { bookingId })
                            if (response && response.data.status == 200) {
                                let product = [...productList]
                                product[index].orderStatus = 'Cancel'
                                setProductList(product)

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
                },
            ],
            { cancelable: false },
        );

    }


    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                {loading && <Loder data={loading}></Loder>}
                <HeaderWithDrawer
                    onActionLeft={() => navigation.openDrawer()}
                    label="My Order"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                {
                    productList.length
                        ? <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={CustomStyles.scrollview}
                        >
                            <View>
                                {productList.map((item, index) => <OrderHistory
                                    key={item._id}
                                    onSelect={() => { navigation.navigate('OrderDetails', { orderId: item._id }) }}
                                    onCancel={() => { }}
                                    productData={item} index={index}
                                />
                                )}
                            </View>
                        </ScrollView>
                        : <Text style={{ ...CustomStyles.textLine, alignSelf: 'center', fontSize: 20 }}>No data found</Text>
                }
            </SafeAreaView>
        </View>
    </>
}

const mapStateToProps = (state) => {
    return {
        isGaust: state.auth.isGaust
    };
}
const mapDispatchToProps = dispatch => {
    return {
        exitToExplore: () => {
            dispatch(exitToExplore())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrderScreen)