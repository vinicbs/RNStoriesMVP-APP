import { StyleSheet, Dimensions } from "react-native";
import Colors from "./Colors";
import { getBottomSpace } from 'react-native-iphone-x-helper'

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;

export const CommonStyles = StyleSheet.create({
    textField: {
        paddingLeft: 25,
        margin: 15,
        borderWidth: 1,
        borderRadius: 35,
        width: WIDTH*0.7,
        height: HEIGHT*0.08,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "black",
        shadowOffset: { width: 10, height: 10 }
    },
    button: {
        margin: 25,
        borderWidth: 1,
        borderRadius: 35,
        width: WIDTH*0.7,
        height: HEIGHT*0.1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "black",
        shadowOffset: { width: 10, height: 10 }
    }
});

