import React, { useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

import { colors, fonts } from '../utils/constant'
import TextInputMask from 'react-native-text-input-mask';

import ToggleSwitch from 'toggle-switch-react-native'
const InputBox = (props) => {
    let { onAction } = props
    useEffect(() => {
    }, [])
    return (



        <View style={[{ width: props.width, marginTop: props.marginTop }]}>
            <Text style={[styles.robotoRegularText, { fontSize: 12, color: props.labelColor, marginLeft: 20, marginBottom: 10 }]}>{props.label}</Text>
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderColor}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                value={props.value}
                multiline={props.multiline ? props.multiline : false}
                maxLength={props.maxLength}
                onChangeText={(text) => props.onChangeText(text)}
                keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: props.height, backgroundColor: props.backgroundColor, }]}>

            </TextInput>
        </View>
    )
}



export const InputBoxmultiline = (props) => {
    let { onAction } = props
    useEffect(() => {
        console.log('props ', props)
    }, [])
    return (



        <View style={[{ width: props.width, marginTop: props.marginTop }]}>
            <Text style={[styles.robotoRegularText, { fontSize: 12, color: props.labelColor, marginLeft: 20, marginBottom: 10 }]}>{props.label}</Text>
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderColor}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                value={props.value}
                multiline={props.multiline ? props.multiline : false}
                maxLength={props.maxLength}
                onChangeText={(text) => props.onChangeText(text)}
                keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: props.height, backgroundColor: props.backgroundColor, }]}>

            </TextInput>
        </View>
    )
}
export const InputBoxTab = (props) => {
    let { onAction } = props
    useEffect(() => {
    }, [])
    return (



        <View style={[styles.card, { width: props.width, marginTop: props.marginTop }]}>
            <Text style={[styles.robotoRegularText, { fontSize: 12, color: props.labelColor }]}>{props.label}</Text>
            <Input
                placeholder={props.placeholder}
                onChangeText={(text) => props.onChangeText(text)}
            />
        </View>
    )
}

export const InputToggele = (props) => {
    let { onAction } = props
    useEffect(() => {
        console.log('props inggggg', props)
    }, [props])
    return (


        <ToggleSwitch
            isOn={props.status}
            onColor={props.titleText?props.titleText:colors.titleText}
            offColor={props.tabGray?props.tabGray:colors.tabGray}
            label=""
            labelStyle={{ color: "black", fontWeight: "900" }}
            size="small"
            onToggle={isOn => props.onChangeText(isOn)}
        />
    )
}




export const MaskedInputBox = (props) => {
    let { onAction } = props
    useEffect(() => {
    }, [])
    return (

        <View style={[{ width: props.width, marginTop: props.marginTop }]}>
            <Text style={[styles.robotoRegularText, { fontSize: 12, color: props.labelColor, marginLeft: 20, marginBottom: 10 }]}>{props.label}</Text>
            <TextInputMask


                secureTextEntry={false}
                keyboardType={'numeric'}
                onChangeText={(text) => props.onChangeText(text)}
                value={props.value}
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderColor}
                mask={"[0000] [0000] [0000] [0000]"}
                style={[styles.card, styles.button, { width: '100%', borderRadius: 8, color: props.inputTextColor, height: props.height, backgroundColor: props.backgroundColor, }]}
            />
        </View>


    )
}
export default InputBox

var styles = StyleSheet.create({
    robotoRegularText: {
        fontFamily: fonts.robotoRegular,
        color: colors.subTitleColor
    },
    robotoBoldText: {
        fontFamily: fonts.robotoBold,
        color: colors.grayColor
    },
    card: {
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        justifyContent: 'center',
        
        borderRadius: 8

    },
    button: {

        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: fonts.robotoRegular,
        fontSize: 19
    },
    underlineStyleBase: {
        width: 50,
        height: 50,
        backgroundColor: colors.inputBoxBackground,
        borderRadius: 25,
        borderWidth: 1,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: colors.greenText1,
        backgroundColor: colors.greenText1,
        color: colors.white
    },

});