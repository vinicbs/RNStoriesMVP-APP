import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import { CommonStyles, HEIGHT, WIDTH } from "src/utils/styles/CommonStyles";
import defaultAvatar from 'src/assets/images/default-avatar.png';
import Colors from "../../utils/styles/Colors";
import Video from 'react-native-video'

/**
 * The Home screen
 */
export default class StoriesPlayer extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });



    constructor(props) {
        super(props)
        this.state = {
            id: this.props.item.id,
            name: this.props.item.name,
            photo: this.props.item.photo,
            videos: [
                "http://techslides.com/demos/sample-videos/small.mp4"
            ],

            videoIndex: 0,
            loading: false,
        }
    }

    componentDidUpdate() {
        console.log('oiss');
        this.updateUser();
    }

    updateUser() {
        if (this.state.id !== this.props.item.id) {
            this.setState({
                id: this.props.item.id,
                name: this.props.item.name,
                photo: this.props.item.photo,
                videos: [
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                ],
                videoIndex: 0,
                loading: false
            })
        }
    }

    onVideoEnd = () => {
        let { videoIndex, videos } = this.state;
        console.log(videoIndex)
        console.log(videos.length)
        console.log('----------')
        if (videoIndex === (videos.length - 1)) {
            this.props.userStoriesEnded();
        } else {
            this.setState({ videoIndex: videoIndex + 1 })
        }
    }

    render() {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image source={this.state.photo ? { uri: this.state.photo } : defaultAvatar} resizeMode='center' style={styles.avatar} />
                    </View>
                    <Text style={styles.text}>{this.state.name} {this.state.id}</Text>
                    <View></View>
                </View>
                <Video source={{ uri: this.state.videos[this.state.videoIndex] }}
                    resizeMode='contain'
                    onEnd={() => this.onVideoEnd()}
                    style={styles.backgroundVideo}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'black',
        width: WIDTH * 0.9,
        height: HEIGHT * 0.9,
        alignSelf: 'center',
        marginBottom: 150
    },
    backgroundVideo: {
        position: 'absolute',
        top: '10%',
        left: 0,
        bottom: 0,
        right: 0,
    },
    header: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    avatarContainer: {
        width: '10%',
    },
    avatar: {
        width: 40,
        height: 40,
        marginLeft: 20,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    text: {
        fontSize: 20,
        width: '80%',
        color: 'white',
        textAlign: 'center'
    },
    countContainer: {

    }
});