import React, { useState } from 'react'
import { View, SafeAreaView, StatusBar, Dimensions, StyleSheet } from 'react-native'

import axios from '../../api'
import SharedClass from '../../utils/SharedClass'
import Loder from '../../utils/Loder'
import Button, { HeaderWithBack, ButtonDropDown } from '../../component/Button'
import { CustomStyles } from '../style/CustomStyles'
import { colors, fonts } from '../../utils/constant'
import Modal from '../../component/Modal'
import InputBox, { ErrorMsg } from '../../component/InputBox'

const { height, width } = Dimensions.get('window')

const REASON = [
    {
        title: 'Reason 1',
        _id: 'Reason 1',
    },
    {
        title: 'Reason 2',
        _id: 'Reason 2',
    },
    {
        title: 'Reason 3',
        _id: 'Reason 4',
    }
]
const HelpCenterScreen = (props) => {
    const { navigation } = props
    const sharedClass = new SharedClass()

    const [loading, setLoading] = useState(false)
    const [selectedReason, setSelectedReason] = useState('Select Reason')
    const [showReason, setShowReason] = useState(false)
    const [message, setMessage] = useState('')
    const [errors, setError] = useState({
        selectedReason: '',
        message: '',
    })

    const onShowModal = () => {
        setShowReason(true)
    }

    const onReasonSelect = (item) => {
        setSelectedReason(item.title)
        setShowReason(false)
    }


    const onSubmit = async () => {

        setError({
            selectedReason: '',
            message: '',
        })

        if (selectedReason == 'Select Reason') {
            setError({
                selectedReason: 'Reasaon is invalid/required',
            })
            return
        }

        if (!message.trim()) {
            setError({
                message: 'Message is invalid/required',
            })
            return
        }



        try {
            setLoading(true)
            let response = await axios.post('user/support', { reason: selectedReason, concern: message })
            setLoading(false)
            if (response && response.data.status == 200) {
                setSelectedReason('Select Reason')
                setMessage('')

                sharedClass.ShowSnakBar({
                    message: response.data.message,
                    type: 'success',
                    delay: 300
                })
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
    return <>
        <View style={CustomStyles.container}>
            <SafeAreaView style={CustomStyles.mainContainer}>
                {showReason
                    ?
                    <Modal
                        onSelect={onReasonSelect}
                        modalClose={() => setShowReason(false)}
                        list={REASON}
                        headerText="Select Reason"
                        alreadySelected={selectedReason}
                    />
                    : null
                }
                {loading && <Loder data={loading}></Loder>}
                <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarColor} />
                <HeaderWithBack
                    onActionLeft={() => { navigation.goBack() }}
                    label="Help Center"
                    labelStyle={{
                        color: colors.white,
                        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                        fontWeight: Platform.OS == 'ios' ? '600' : null
                    }}
                />
                <View style={styles.content}>
                    <ButtonDropDown
                        palceholder={selectedReason}
                        onAction={onShowModal}
                        buttonStyle={{
                            height: 60,
                            backgroundColor: colors.inputBoxBackground,
                            width: width - 40,
                            borderRadius: 10,
                            marginBottom: 0,
                        }}
                        placeholderStyle={{
                            color: colors.palceholderColor,
                            fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
                            fontStyle: Platform.OS == 'ios' ? 'normal' : null,
                            fontWeight: Platform.OS == 'ios' ? '600' : null,
                            fontSize: 13,
                            marginLeft: 20,
                            marginRight: 0
                        }}

                        containerStyle={{
                            width: width - 40
                        }}
                    />
                    {errors.selectedReason ? <ErrorMsg message={errors.selectedReason} /> : null}
                    <InputBox
                        height={150}
                        backgroundColor={colors.inputBox}
                        width={(width - 40)}
                        multiline={true}
                        borderRadius={30}
                        marginTop={20}
                        placeholder="Write here ..."
                        placeholderColor={colors.placeHolderColor}
                        inputTextColor={colors.inputTextColor}
                        editable={true}
                        value={message}
                        maxLength={400}
                        onChangeText={(text) => setMessage(text)}
                    />
                    {errors.message ? <ErrorMsg message={errors.message} /> : null}
                    <Button
                        height={60}
                        backgroundColor={colors.ornageButton}
                        width={width - 130}
                        borderRadius={8}
                        marginTop={50}
                        label="Submit"
                        labelColor={colors.inputBox}
                        onAction={() => onSubmit()}
                        fontSize={17}
                        fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.semiBold}
                        fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                        fontWeight={Platform.OS == 'ios' ? '700' : null}
                    />
                </View>

            </SafeAreaView>
        </View>
    </>

}
const styles = StyleSheet.create({
    content: {
        marginTop: 15,
        alignItems: 'center',
    }
})


export default HelpCenterScreen