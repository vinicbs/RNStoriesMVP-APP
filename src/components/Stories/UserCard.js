import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import { CommonStyles, HEIGHT, WIDTH } from "src/utils/styles/CommonStyles";
import defaultAvatar from 'src/assets/images/default-avatar.png'

/**
 * The Home screen
 */
export default class UserCard extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.item.id,
            name: this.props.item.name,
            photo: this.props.item.photo,

            loading: false
        }
    }

    render() {
        return (
            <TouchableOpacity style={styles.box} onPress={() => this.props.onCardClick(this.props.index)}>
                <Image source={this.state.photo ? { uri: this.state.photo } : defaultAvatar} resizeMode='center' style={styles.avatar} />
                <View style={styles.textBox} />
                <Text style={styles.text}>{this.state.name}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        alignSelf: 'center',
        borderWidth: 1,
        width: WIDTH * 0.8,
        height: HEIGHT * 0.5,
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'grey',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 7,
        shadowOffset: { x: 0, y: 10 }
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    textBox: {
        position: 'absolute',
        width: '100%',
        height: '15%',
        top: '85%',
        backgroundColor: 'black',
        opacity: 0.8
    },
    text: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '15%',
        padding: 15,
        fontSize: 14,
        color: 'white',
        flexWrap: 'wrap',
        textAlign: 'center'
    }
});