import React, { useState, useEffect } from 'react'
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {
  VideoSkipBack,
  VideoPrevious,
  VideoPause,
  VideoPlay,
  VideoNext,
  VideoSkipForward,
} from '../../assets/icons/index';

const PlayerControls = (props) => {
  let { playing,
    showPreviousAndNext,
    showSkip,
    previousDisabled,
    nextDisabled,
    onPlay,
    onPause,
    skipForwards,
    skipBackwards,
    onNext,
    onPrevious}=props
  useEffect(() => {
      console.log('props', props)
  }, [])
  return (

    <View style={styles.wrapper}>
    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, previousDisabled && styles.touchableDisabled]}
        onPress={onPrevious}
        disabled={previousDisabled}>
        
        <Image source={VideoPrevious} style={{height:30,width:30}} />
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
       
        <Image source={VideoSkipBack} style={{height:30,width:30}} />
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.touchable}
      onPress={playing ? onPause : onPlay}>
      {playing ?  <Image source={VideoPause} style={{height:30,width:30}} />  : <Image source={VideoPlay} style={{height:30,width:30}} /> }
    </TouchableOpacity>

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        
        <Image source={VideoSkipForward} style={{height:30,width:30}} />
      </TouchableOpacity>
    )}

    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
        onPress={onNext}
        disabled={nextDisabled}>
        
        <Image source={VideoNext} style={{height:30,width:30}} />
      </TouchableOpacity>
    )}
  </View>
  )
}

export default PlayerControls


const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
