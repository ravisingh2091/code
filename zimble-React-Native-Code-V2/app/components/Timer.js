import React, { useState, useEffect } from 'react'

import {View, Text, StyleSheet} from 'react-native';
import moment from "moment";
import { colors, } from '../utils/constant'


const Timer = (props) => {
  let {  
    timer,
    currentTime,
    duration,
    onSlideCapture,
   }=props
  useEffect(() => {
    
    var eventTime= timer; // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
    var currentTime = new Date().getTime(); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
    var diffTime = eventTime - currentTime;
    var duration = moment.duration(diffTime*1000, 'milliseconds');
    var interval = 1000;
    duration = moment.duration(duration - interval, 'milliseconds');
    console.log(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds())
  }, [])
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);
  function getMinutesFromSeconds(time: number) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }

  function handleOnSlide(time: number) {
    console.log(time)
    onSlideCapture({seekTime: time});
  }
  return (
    <View style={{}}>
    <Text style={{color:colors.red}}>Expired</Text>
    
  </View>
  )
}

export default Timer


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});

