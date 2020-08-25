import React, { useState } from 'react'
import moment from 'moment'
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

import { colors, fonts, localImages } from '../utils/constant'
import { AddButton, SkuButton } from './Button'
import Modal from './Modal'
const { width } = Dimensions.get('window');

const ProductView = (props) => {

    const [sku, setSku] = useState(props.productData.measurementArray[0])
    const [model, setModel] = useState(false)
    const [showIndex, setShowIndex] = useState(0)


    const selectSku = (item) => {
        setSku(item)
        let index = props.productData.measurementArray.findIndex(value => value._id === item._id)
        setShowIndex(index)
        setModel(false)
    }

    return (
        <View style={{ ...styles.ProductView, width: (width / 2) - 30 }} >
            <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: colors.green, minHeight: 30, borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15, justifyContent: 'center' }}>
                    <Text style={{ ...styles.nameText, marginHorizontal: 10 }}>{sku.offerPer} % off</Text>
                </View>
                <View style={{ position: 'absolute', right: 5 }}>
                    <TouchableOpacity onPress={() => props.onFavirite(props.productData.isFavirite)}>
                        <Image source={props.productData.isFavirite ? localImages.fav_s : localImages.fav_un} style={{ height: 30, width: 30 }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => props.onProduct()}>
                <Image source={{ uri: props.productData.productImages[0].image }} style={{ height: 100, width: 100, alignSelf: 'center' }}></Image>
                {
                    sku.stockAvailable == 0 || sku.status == 'Inactive'
                        ? <View
                            style={{
                                position: 'absolute',
                                top: 50,
                                left: 60,
                                backgroundColor: colors.outOfStock,
                                opacity: .7
                            }}>
                            <Text
                                style={{
                                    ...styles.nameText,
                                    marginHorizontal: 10,
                                    color: colors.red,
                                    fontSize: 17
                                }}>
                                Sold Out
                                </Text>
                        </View>
                        : null
                }
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={() => props.onProduct()}>
                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                        {props.productData.productName}
                    </Text>
                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                        ({props.productData.brand})
                        </Text>
                </TouchableOpacity>
                <SkuButton
                    height={30}
                    backgroundColor={colors.ornageButton}
                    width={60}
                    borderRadius={8}
                    marginTop={10}
                    label="Add"
                    labelColor={colors.white}
                    onAction={() => setModel(true)}
                    fontSize={15}
                    data={props.productData}
                    showIndex={showIndex}
                    fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                    fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                    fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                />
            </View>
            <View>
                <Text
                    style={{
                        ...styles.mrp,
                        marginHorizontal: 10,
                        color: colors.backText,
                        fontSize: 17
                    }}>
                    ₹{sku.actualPrice}
                </Text>
                <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                    ₹{sku.showPrice}
                </Text>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10, height: 40 }}>

            </View>
            <View style={{ position: 'absolute', bottom: 10, width: '100%', alignItems: 'center' }}>
                <AddButton
                    height={30}
                    backgroundColor={colors.ornageButton}
                    width={60}
                    borderRadius={4}
                    marginTop={10}
                    label="Add"
                    labelColor={colors.white}
                    addProduct={() => props.addProduct(sku._id)}
                    fontSize={15}
                    outofStock={sku.stockAvailable == 0 || sku.status == 'Inactive'}
                    data={props.cartItem[sku._id] ? props.cartItem[sku._id].quantity : 0}
                    fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                    fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                    fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                    quantityInc={() => props.quantityInc(sku._id)}
                    quantityDesc={() => props.quantityDesc(sku._id)}
                />
            </View>
            {model
                ? <Modal
                    headerText="Select Quentity"
                    onSelect={(item) => selectSku(item)}
                    list={props.productData.measurementArray.map(value => {
                        return { ...value, title: value.unit + value.measurement }
                    })}
                    alreadySelected=""
                    modalClose={() => setModel(false)}
                />
                : null}
        </View>
    )
}


export const ProductViewHorizontal = (props) => {

    const [sku, setSku] = useState(props.productData.measurementArray[0])
    const [model, setModel] = useState(false)
    const [showIndex, setShowIndex] = useState(0)

    const selectSku = (item) => {
        setSku(item)
        let index = props.productData.measurementArray.findIndex(value => value._id === item._id)
        setShowIndex(index)
        setModel(false)
    }

    return (
        <View style={styles.ProductView} >
            <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: colors.green, minHeight: 30, borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderTopRightRadius: 15, justifyContent: 'center' }}>
                    <Text
                        style={{
                            ...styles.nameText,
                            marginHorizontal: 10
                        }}>
                        {sku.offerPer} % off
                    </Text>

                </View>
                <View style={{ position: 'absolute', right: 5 }}>
                    <TouchableOpacity onPress={() => props.onFavirite(props.productData.isFavirite)}>
                        <Image source={props.productData.isFavirite ? localImages.fav_s : localImages.fav_un} style={{ height: 30, width: 30 }}></Image>
                    </TouchableOpacity>

                </View>

            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => props.onProduct()}>
                    <Image
                        source={{ uri: props.productData.productImages[0].image }}
                        style={{ height: 100, width: 100, alignSelf: 'center' }} />
                    {
                        props.productData.stockAvailable == 0
                            ? <View
                                style={{
                                    position: 'absolute',
                                    top: 30,
                                    left: 10,
                                    backgroundColor: colors.outOfStock,
                                    opacity: .7
                                }}>
                                <Text
                                    style={{
                                        ...styles.nameText,
                                        marginHorizontal: 10,
                                        color: colors.red,
                                        fontSize: 17
                                    }}>
                                    Sold Out
                                    </Text>
                            </View>
                            : null
                    }
                </TouchableOpacity>
                <View>
                    <TouchableOpacity onPress={() => props.onProduct()}>
                        <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                            {props.productData.productName}({props.productData.brand})
                        </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <SkuButton
                                height={30}
                                backgroundColor={colors.ornageButton}
                                width={60}
                                borderRadius={8}
                                marginTop={10}
                                label="Add"
                                labelColor={colors.white}
                                onAction={() => setModel(true)}
                                fontSize={15}
                                data={props.productData}
                                showIndex={showIndex}
                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                            />

                            <Text
                                style={{
                                    ...styles.mrp,
                                    marginHorizontal: 10,
                                    color: colors.backText,
                                    fontSize: 17
                                }}>
                                ₹{sku.actualPrice}
                            </Text>
                            <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                ₹{sku.showPrice}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <AddButton
                    height={30}
                    backgroundColor={colors.ornageButton}
                    width={60}
                    borderRadius={4}
                    marginTop={10}
                    label="Add"
                    labelColor={colors.white}
                    addProduct={() => props.addProduct(sku._id)}
                    fontSize={15}
                    outofStock={sku.stockAvailable == 0}
                    data={props.cartItem[sku._id] ? props.cartItem[sku._id].quantity : 0}
                    fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                    fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                    fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                    quantityInc={() => props.quantityInc(sku._id)}
                    quantityDesc={() => props.quantityDesc(sku._id)}
                />
            </View>
            {model
                ? <Modal
                    headerText="Select Quentity"
                    onSelect={(item) => selectSku(item)}
                    list={props.productData.measurementArray.map(value => {
                        return { ...value, title: value.unit + value.measurement }
                    })}
                    alreadySelected=""
                    modalClose={() => setModel(false)}
                />
                : null}
        </View>
    )
}

export const ProductViewMyCart = (props) => {
    const [sku, setSku] = useState(() => props.productData.measurementArray.find(value => value._id == props.sku))
    const [showIndex, setShowIndex] = useState(props.productData.measurementArray.findIndex(value => value._id == props.sku))

    return (
        <View  >
            <View style={{ flexDirection: 'row' }}>
                <View style={{ backgroundColor: colors.green, minHeight: 30, borderTopLeftRadius: props.index == 0 ? 15 : 0, borderBottomRightRadius: 15, borderTopRightRadius: 15, justifyContent: 'center' }}>
                    <Text style={{ ...styles.nameText, marginHorizontal: 10 }}>{sku.offerPer} % off</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => props.onProduct()}>
                    <Image source={{ uri: props.productData.productImages[0].image }} style={{ height: 100, width: 100, alignSelf: 'center' }}></Image>
                    {props.productData.outofStock ? <View style={{ position: 'absolute', top: 30, left: 10, backgroundColor: colors.outOfStock, opacity: .7 }}>
                        <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.red, fontSize: 17, }}>Sold Out</Text>
                    </View> : null}
                </TouchableOpacity>
                <View>
                    <TouchableOpacity onPress={() => props.onProduct()}>
                        <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>{props.productData.productName}({props.productData.brand})</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <SkuButton
                                height={30}
                                backgroundColor={colors.ornageButton}
                                width={60}
                                borderRadius={8}
                                marginTop={10}
                                label="Add"
                                labelColor={colors.white}
                                fontSize={15}
                                data={props.productData}
                                showIndex={showIndex}
                                onAction={() => { }}
                                fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                                fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                                fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                            />
                            <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                                ₹{sku.actualPrice}
                            </Text>
                            <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>  ₹{sku.showPrice}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <AddButton
                    height={30}
                    backgroundColor={colors.ornageButton}
                    width={60}
                    borderRadius={4}
                    marginTop={10}
                    label="Add"
                    labelColor={colors.white}
                    addProduct={() => props.addProduct(sku._id)}
                    fontSize={15}
                    outofStock={sku.stockAvailable == 0}
                    data={props.cartItem[sku._id] ? props.cartItem[sku._id].quantity : 0}
                    fontFamily={Platform.OS == 'ios' ? fonts.regular : fonts.regular}
                    fontStyle={Platform.OS == 'ios' ? 'normal' : null}
                    fontWeight={Platform.OS == 'ios' ? 'normal' : null}
                    quantityInc={() => props.quantityInc(sku._id)}
                    quantityDesc={() => props.quantityDesc(sku._id)}
                />
            </View>
        </View>
    )
}


export const ProductViewOrderDetails = (props) => {
    const { productData } = props
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <View>
                    <Image source={{ uri: productData.productImages[0].image }} style={{ height: 80, width: 80, alignSelf: 'center' }}></Image>
                </View>
                <View>
                    <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>
                        {productData.productName}({productData.productBrand})
                        </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17, }}>
                                ₹{productData.amountWithQuantuty}x{productData.quantity}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
export const OrderHistory = (props) => {
    const { productData } = props
    return (
        <View style={styles.ProductView} >
            <TouchableOpacity onPress={() => props.onSelect()} style={{ height: 50, justifyContent: 'center', width: width, borderBottomWidth: .5, borderBottomColor: colors.grayColor }}>
                <Text style={{ ...styles.nameText, color: colors.grayColor, marginLeft: 10 }}>Order No.<Text style={{ ...styles.mrp, color: colors.backText, marginLeft: 10 }}>{productData.orderNumber}</Text></Text>
                <Text style={{ ...styles.nameText, color: colors.grayColor, position: 'absolute', right: 20 }}>
                    {moment(productData.createdAt).format("MMM, Do YYYY")}
                </Text>
            </TouchableOpacity>
            <View style={{ height: 60, width: width }}>
                <Text style={{ ...styles.mrp, marginHorizontal: 10, color: colors.backText, fontSize: 17 }}>₹{productData.totalPrice}</Text>
                <Text style={{ ...styles.nameText, marginHorizontal: 10, color: colors.grayColor, fontSize: 17 }}>{productData.orderData.length} Item</Text>
                <TouchableOpacity onPress={() => props.onCancel()} disabled={!(productData.orderStatus == "Pending" || productData.orderStatus == "Accept" || productData.orderStatus == "Shipped")}
                    style={{
                        position: 'absolute', right: 20,
                        backgroundColor: productData.orderStatus === 'Cancel' ? colors.redLight : productData.orderStatus === "Delivered" ? colors.greenLight : colors.red,
                        height: 30, borderRadius: 5, width: 80, justifyContent: 'center', alignItems: 'center', marginTop: 20
                    }}>
                    <Text
                        style={{
                            ...styles.nameText,
                            color: productData.orderStatus === 'Cancel' ? colors.red : productData.orderStatus === "Delivered" ? colors.green : colors.white
                        }}>{productData.orderStatus}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProductView



const styles = StyleSheet.create({
    ProductView: {
        backgroundColor: '#fff',
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
    },
    categoryButton: {
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.ornageButton,
        width: (width / 3) - 30,
        marginTop: -30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameText: {
        color: colors.white,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.regular,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? 'normal' : null
    },
    mrp: {
        color: colors.white,
        fontFamily: Platform.OS == 'ios' ? fonts.regular : fonts.semiBold,
        fontStyle: Platform.OS == 'ios' ? 'normal' : null,
        fontWeight: Platform.OS == 'ios' ? '600' : null
    }

})