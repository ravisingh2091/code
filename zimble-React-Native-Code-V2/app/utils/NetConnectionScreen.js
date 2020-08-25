import React,{useState,useEffect} from 'react'
import {View,Text,Dimensions} from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import {colors} from './constant'
var { height, width } = Dimensions.get('window');
const NetConnectionScreen=(props)=>{
    useEffect(()=>{
    console.log('props',props.data)
    getOGTagsData(props.data)
    const unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type,NetConnectionScreen", state.type);
        console.log("Is connected NetConnectionScreen?", state.isConnected);
        setNetConncetionStatus(state.isConnected)
      });
    },[])
    const [data,setData]=useState()
    const [netConncetionStatus,setNetConncetionStatus]=useState(true)
    const getOGTagsData=(Text)=>{
        
        if(Text!=null){
            setData(Text)
        }
        
        console.log(data)
}
    return(
         
        <View>
           {!netConncetionStatus && <View style={{width:width, backgroundColor:colors.warning ,alignItems: 'center', justifyContent: 'center',height:30 }}>
              <Text style={{color:colors.inputTextColor}}>Please check Internet Connection</Text>
           </View>}
        </View>

    )
}
export default NetConnectionScreen