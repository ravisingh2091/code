import React, { useState, useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
// import NetInfo from "@react-native-community/netinfo";
import { colors } from './constant'
const LoaderScreen = (props) => {
    // useEffect(() => {
    //     getOGTagsData(props.data)
    //     NetInfo.addEventListener(state => {
    //         if (state.isConnected == false) {
    //             getOGTagsData(false)
    //         } else {
    //         }
    //     });
    // }, [])
    // const [data, setData] = useState()
    // const getOGTagsData = (Text) => {

    //     if (Text != null) {
    //         setData(Text)
    //     }
    // }
    return (

        <Spinner
            visible={props.data}
            // textContent={'Please wait'}
            color={colors.warning}
            textStyle={{ color: colors.warning }}
        />


    )
}
export default LoaderScreen