import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, StatusBar, ScrollView, Platform, Dimensions } from 'react-native'
import HTML from 'react-native-render-html';


import axios from '../../api'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass'

const { height, width } = Dimensions.get('window')

const AboutUsScreen = (props) => {
    const { navigation } = props
    const sharedClass = new SharedClass();

    const [loading, setLoading] = useState(false)
    const [terms, setTerms] = useState({})
    const [scrollEnabled, setScrollEnabled] = useState(true)

    useEffect(() => {
        getOffer()
    }, [])

    const getOffer = async () => {
        try {
            setLoading(true)
            let response = await axios.post('static/getStaticContentByType', {
                type: 'aboutUs',
                userType: 'User'
            })
            setLoading(false)
            if (response && response.data.status == 200) {
                setTerms(response.data.data)
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


    const onContentSizeChange = (contentWidth, contentHeight) => {
        setScrollEnabled(Platform.OS == 'ios' ? true : contentHeight > height)
    };
    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="About Us"
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

                    <View style={{ margin: 15 }}>
                        <HTML html={terms?.description} imagesMaxWidth={width} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    </>
}



export default AboutUsScreen