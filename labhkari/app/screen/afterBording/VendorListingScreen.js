import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StatusBar, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { getCurrentPosition } from '@react-native-community/geolocation';
import { connect } from 'react-redux';

import axios from '../../api'
import { HeaderWithBack } from '../../component/Button';
import { CustomStyles } from '../style/CustomStyles';
import { colors, fonts, localImages } from '../../utils/constant';
import VendorListingStyles from '../style/VendorListingStyles';
import SharedClass from '../../utils/SharedClass'
import Loder from '../../utils/Loder'
import { setDefaultSeller } from '../../redux/actions/AllAction';



const VendorListingScreen = ({ navigation, updateDefaultSeller }) => {
    const sharedClass = new SharedClass();
    const [vendor, setVendor] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getCurrentPosition(info => {
            getVendor(info.coords.longitude, info.coords.latitude)
        });

    }, [])

    const getVendor = async (longitude, latitude) => {
        try {
            setLoading(true)
            let response = await axios.post('user/getSellerList', { longitude, latitude })
            setLoading(false)
            if (response && response.data.status == 200) {
                setVendor(response.data.data)
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

    const setDefaultVender = (item) => {
        updateDefaultSeller(item)
        navigation.goBack()
    }

    const flateList = (item, index) => {
        return <>
            <TouchableOpacity
                style={{ ...VendorListingStyles.contentView, marginBottom: vendor.length - 1 == index ? 20 : 10 }}
                onPress={() => setDefaultVender(item)}
            >
                <View style={{ flex: 2 }}>
                    <Image source={{ uri: item.profilePic }} style={{ height: 80, width: 80 }} />

                </View>
                <View style={{ flex: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={VendorListingStyles.nameText}>
                            {item.providerName}
                        </Text>
                        <Text style={VendorListingStyles.kmText}>
                            {(item.dist.calculated / 1000).toFixed(2)}km
                        </Text>
                        <View >
                            <Image source={localImages.nav} style={{ height: 30, width: 30, flex: 1 }} />
                        </View>
                    </View>
                    <Text style={VendorListingStyles.addressText}>
                        {item.address}
                    </Text>

                </View>

            </TouchableOpacity>

        </>
    }
    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="Vendor Listing"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />

                <View style={{ marginTop: 15 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={vendor}
                        renderItem={({ item, index }) => flateList(item, index)}
                        keyExtractor={item => item._id}
                    />
                </View>
            </SafeAreaView>
        </View>
    </>
}


const mapDispatchToProps = dispatch => {
    return {
        updateDefaultSeller: (sellerData) => {
            dispatch(setDefaultSeller(sellerData))
        }
    }
}
export default connect(null, mapDispatchToProps)(VendorListingScreen)
