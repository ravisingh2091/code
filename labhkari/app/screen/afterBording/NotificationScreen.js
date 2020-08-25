import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StatusBar, FlatList, Text, Dimensions } from 'react-native'
import moment from "moment";


import axios from '../../api'
import SharedClass from '../../utils/SharedClass'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import { NotificationStyles } from '../style/NotificationStyles'
import Loder from '../../utils/Loder'

const { height } = Dimensions.get("window")

const NotificationScreen = (props) => {
    const { navigation } = props
    const sharedClass = new SharedClass()

    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState([])

    useEffect(() => {
        getNotiList()
    }, [])


    const getNotiList = async () => {
        try {
            setLoading(true)
            let response = await axios.get('user/getNotificationList')
            setLoading(false)
            if (response && response.data.status == 200) {
                setNotification(response.data.data)

            } else {
                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'error',
                    delay: 0
                })
            }

        } catch (error) {
            setLoading(false)
            console.error({ error })
        }
    }



    const flateList = (item, index) => {
        return <>
            <View style={CustomStyles.container}>
                <View style={{ ...NotificationStyles.contentView, marginBottom: notification.length - 1 == index ? 20 : 7 }}>
                    <Text style={NotificationStyles.titleText}>
                        {
                            item.notiTitle.length > 48
                                ? item.notiTitle.substring(0, 48) + '...'
                                : item.notiTitle
                        }
                    </Text>
                    <Text style={NotificationStyles.time}>{moment(item.createdAt).fromNow()}</Text>
                </View>
            </View>
        </>
    }
    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="Notification"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <View style={{ marginTop: 15, height: height }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={notification}
                        renderItem={({ item, index }) => flateList(item, index)}
                        keyExtractor={item => item._id}
                    />
                </View>
            </SafeAreaView>
        </View>
    </>
}




export default NotificationScreen