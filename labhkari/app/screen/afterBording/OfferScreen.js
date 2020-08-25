import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, ScrollView, Platform, Image, Text } from 'react-native'
import moment from 'moment'

import axios from '../../api'
import { HeaderWithDrawer } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

const { height, width } = Dimensions.get('window')

const OfferScreen = (props) => {
    const { navigation, } = props
    const sharedClass = new SharedClass();

    const [loading, setLoading] = useState(false)
    const [offerList, setOfferList] = useState([])

    useEffect(() => {
        getOffer()
    }, [])

    const getOffer = async () => {
        try {
            setLoading(true)
            let response = await axios.get('user/getOfferList')
            setLoading(false)
            if (response && response.data.status == 200) {
                setOfferList(response.data.data)
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
                    label="Offers"
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
                >
                    {
                        offerList.map((item, index) => {
                            return <View key={item._id}>
                                <Image
                                    resizeMode={'contain'}
                                    source={{ uri: item.offerImage }}
                                    style={{
                                        width: width,
                                        height: width * .54
                                    }}
                                />
                                <Text style={{ paddingHorizontal: 20 }}>
                                    {item.description}
                                </Text>
                                <Text style={{ alignSelf: 'flex-end', marginRight: 20 }}>
                                    {moment(item.createdAt).format("MMM, Do YYYY")}
                                </Text>
                            </View>
                        })
                    }
                </ScrollView>
            </SafeAreaView>
        </View>
    </>
}



export default OfferScreen