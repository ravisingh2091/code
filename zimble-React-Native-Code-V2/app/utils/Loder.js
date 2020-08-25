import React,{useState,useEffect} from 'react'
import {View,Text,ActivityIndicator,Dimensions} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import {colors} from './constant'
var { height, width } = Dimensions.get('window');
const LoaderScreen=(props)=>{
    useEffect(()=>{
    console.log('props',props.data)
    getOGTagsData(props.data)
    const unsubscribe = NetInfo.addEventListener(state => {
        if(state.isConnected==false){
            getOGTagsData(false)
            
        }else{
        }
      });
    },[])
    const [data,setData]=useState()
    const getOGTagsData=(Text)=>{
        
        if(Text!=null){
            // OpenGraphParser.extractMeta(Text)
            setData(Text)
        }
        
        console.log(data)
}
    return(
         
        <Spinner
        visible={data}
        textContent={'Please wait'}
        color={colors.warning}
       // cancelable={true}
        textStyle={{ color: colors.warning }}
      />
   

    )
}
export default LoaderScreen