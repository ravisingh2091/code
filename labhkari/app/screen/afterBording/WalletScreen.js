import React, { Component } from 'react'
import { Platform, View, Text, SafeAreaView, StatusBar, ImageBackground, FlatList } from 'react-native'

import axios from '../../api'
import { CustomStyles } from '../style/CustomStyles'
import { WalletStyles } from '../style/WalletStyles'
import { colors, localImages, fonts } from '../../utils/constant'
import { HeaderWithBack } from '../../component/Button'
import SharedClass from '../../utils/SharedClass'
import Loder from '../../utils/Loder'


class WalletScreen extends Component {
    sharedClass = new SharedClass();
    state = {
        loading: false,
        walletData: {}
    }


    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getOrder()
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }


    getOrder = async () => {
        try {
            this.setState({ loading: true })
            let response = await axios.get('user/getWalletDetail')
            this.setState({ loading: false })
            if (response && response.data.status == 200) {
                this.setState({
                    walletData: response.data.data
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


    flateList = (item, index) => {
        return <>
            <View key={item._id} style={{ ...WalletStyles.contentView, marginBottom: this.state.walletData?.walletDetail.length - 1 == index ? 20 : 5 }}>
                <Text style={WalletStyles.titleText}>{item.type}</Text>
                <Text style={WalletStyles.pointText}>{item.points || 0}</Text>
                <Text style={{ marginLeft: 10 }}>Point</Text>
            </View>
        </>
    }

    render() {
        const { loading, walletData } = this.state
        return <>
            <View style={CustomStyles.container}>
                <SafeAreaView style={{ ...CustomStyles.mainContainer }}>
                    {loading && <Loder data={loading}></Loder>}

                    <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                    <ImageBackground source={localImages.walletBg} style={WalletStyles.headerImage}>
                        <HeaderWithBack
                            backgroundColor={1}
                            onActionLeft={() => { this.props.navigation.goBack() }}
                            label="My Wallet"
                            labelStyle={{
                                color: colors.white,
                                fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                                fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                                fontWeight: Platform.OS == 'ios' ? '600' : null
                            }}
                        />
                    </ImageBackground>
                    <View style={WalletStyles.pointView}>
                        <Text style={WalletStyles.pointNumber}>{walletData.points}</Text>
                        <Text style={{ ...WalletStyles.pointNumber, fontSize: 16 }}>Points</Text>
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={walletData?.walletDetail}
                        renderItem={({ item, index }) => this.flateList(item, index)}
                        keyExtractor={item => item._id}
                    />

                </SafeAreaView>
            </View>
        </>
    }
}



export default WalletScreen
