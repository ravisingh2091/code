import React, { useState, useEffect } from 'react'
import { View,ActivityIndicator,Text,TextInput,Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
var { height, width } = Dimensions.get('window');
import { colors, fonts, localImages } from '../utils/constant'

const ImageBox = (props) => {
    let {onAction}=props
    useEffect(() => {
        console.log('props', props)
    }, [])
    return (

        <View>
            <Image source={{uri:props.source}} style={{height:150, width:150}} />
            {props.loaderKey.indexOf(props.source.key)!=-1?<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="small" color={colors.white} /></View>:null}
        </View>
    )
}


export const FilePicker = (props) => {
    let { onAction } = props
    useEffect(() => {
        console.log('props', props)
    }, [])
    return (

        <TouchableOpacity onPress={() => props.onAction()} style={[styles.buttonWithoutshadow, { height: props.height, backgroundColor: props.backgroundColor, width: props.width, borderRadius: props.borderRadius, marginTop: props.marginTop, marginBottom: props.marginBottom ? props.marginBottom : 0 }]}>
            <Text style={[styles.buttonText, { color: props.labelColor, fontFamily: props.fontFamily, fontSize: props.fontSize }]}>{props.label}</Text>
        </TouchableOpacity>
    )
}
export default ImageBox

var styles = StyleSheet.create({
    button: {
      
        paddingHorizontal:15,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
       fontFamily:fonts.robotoRegular,
       fontSize:19
    }

});