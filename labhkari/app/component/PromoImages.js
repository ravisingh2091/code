import React, { useState } from 'react'
import { Image, StyleSheet, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-banner-carousel';


import { colors, localImages } from '../utils/constant'
const { width } = Dimensions.get('window');
const PromoImages = (props) => {
  return (
    <Carousel
      index={0}
      pageIndicatorStyle={{
        marginBottom: 10
      }}
      autoplayTimeout={5000}
      autoplay
      loop
      showsPageIndicator={props.data.length > 1 ? true : false}
    >
      {
        props.data.map((item) => {
          return (
            <Image
              resizeMode={'contain'}
              source={{ uri: item.image }}
              style={styles.imageCard}
              key={item._id} />
          );
        })
      }
    </Carousel >

  )
}

export const ProductImages = (props) => {
  return (
    <Swiper
      index={0}
      onIndexChanged={(index) => {
      }}
      showsPagination={true}
      loop={false}
    >
      {
        props.data.length > 0 &&
        props.data.map((item, key) => {
          return (
            <Image
              resizeMode={'contain'}
              source={localImages[item.image]}
              style={styles.imageCard}
              key={key} />
          );
        })}
    </Swiper>
  )
}

export default PromoImages
const styles = StyleSheet.create({
  button: {
    shadowColor: colors.loginshadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.27,
    shadowRadius: 6,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWithoutshadow: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCard: {
    width: width,
    height: width * .54
  }
});