import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import { connect } from 'react-redux'

import axios from '../../api'
import { HeaderWithBack } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts, localImages } from '../../utils/constant'
import AddressListStyles from '../style/AddressListStyles'
import Loder from '../../utils/Loder'
import SharedClass from '../../utils/SharedClass';
import { setDefaultAddress } from '../../redux/actions/AllAction'


const AddressListScreen = ({ navigation, defaultAddress }) => {
    const sharedClass = new SharedClass()

    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState([])

    useEffect(() => {
        let listener = navigation.addListener('focus', () => {
            addressList()
        })
        return listener
    }, [])


    const addressList = async () => {
        try {
            setLoading(true)

            let response = await axios.get('user/getAddressList')
            setLoading(false)

            if (response && response.data.status == 200) {
                setAddress(response.data.data)
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
    const deleteAddress = async (id, index) => {
        try {
            setLoading(true)

            let response = await axios.post('user/deleteAddress', { addressId: id })
            setLoading(false)

            if (response && response.data.status == 200) {
                let tempAdd = [...address]
                tempAdd.splice(index, 1)
                setAddress(tempAdd)
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

    const setDefaultAddress = (address) => {
        defaultAddress(address)
        navigation.goBack()
    }

    const flateList = (item, index) => {
        return <View key={item._id} style={{ ...AddressListStyles.contentView, marginBottom: address.length - 1 == index ? 20 : 10 }}>
            <TouchableOpacity onPress={() => setDefaultAddress(item)} style={{ paddingHorizontal: 5, flex: 6 }}>
                <Text style={AddressListStyles.nameText}>
                    {item.name}
                </Text>
                <Text style={AddressListStyles.addressText}>
                    {item?.address}
                </Text>
                <Text style={AddressListStyles.phoneText}>
                    {item?.countryCode}-{item?.mobileNumber}
                </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEditAddressScreen', { address: item ,location:''})}>
                    <Image source={localImages.dit} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteAddress(item._id, index)}>
                    <Image source={localImages.deletePng} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
            </View>
        </View>
    }

    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="Saved Address"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: 15 }}>
                        {
                            address.map((item, index) => flateList(item, index))
                        }
                    </View>
                </ScrollView>

                <View style={AddressListStyles.addAddress}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddNewAddressScreen', { address: '' })}>
                        <Image source={localImages.add} style={{ height: 80, width: 80 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    </>
}


const mapDispatchToProps = (dispatch) => {
    return {
        defaultAddress: (address) => {
            dispatch(setDefaultAddress(address))
        }
    }
}

export default connect(null, mapDispatchToProps)(AddressListScreen)