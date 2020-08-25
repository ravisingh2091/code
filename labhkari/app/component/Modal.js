import React from 'react'
import { Image, FlatList, TouchableOpacity, View, Text } from 'react-native';
import Model from 'react-native-modal';
import PropTypes from 'prop-types';

import { colors, localImages } from '../utils/constant';
import ModalStyle from './style/ModalStyle'

const Modal = ({ headerText, onSelect, list, alreadySelected, modalClose }) => {

    const renderFlatList = ({ item }) => <>
        <TouchableOpacity
            key={item._id}
            style={{
                backgroundColor: alreadySelected === item.title ? colors.blueLightColor : '#f6f8f9',
                height: 40,
                justifyContent: 'center'
            }}
            onPress={() => onSelect(item)}
            disabled={item.disabled}
        >
            <Text style={ModalStyle.flatListText}>{item.title}</Text>
        </TouchableOpacity>
    </>
    return <>
        <Model
            isVisible={true}
            style={ModalStyle.bottomModal}
            onBackdropPress={() => modalClose()}
        >
            <View style={ModalStyle.modalContent}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: colors.grayColor }}>
                    <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={ModalStyle.headerText}>{headerText}</Text>
                        <TouchableOpacity onPress={() => modalClose()} >
                            <Image style={ModalStyle.closeImage} source={localImages.close} />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={list}
                    renderItem={({ item }) => renderFlatList({ item })}
                    keyExtractor={item => item._id}
                />
            </View>
        </Model>
    </>
}

Modal.propTypes = {
    headerText: PropTypes.string,
    alreadySelected: PropTypes.string,
    onSelect: PropTypes.func,
    modalClose: PropTypes.func,
    list: PropTypes.array
}


export default Modal