import * as React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
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
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';

/**
 * The Home screen
 */
export default class StoriesPlayer extends React.Component {
    videoPlayer;
    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });



    constructor(props) {
        super(props)
        this.state = {
            id: this.props.item.id,
            name: this.props.item.name,
            photo: this.props.item.photo,
            videos: this.props.item.stories,

            videoIndex: 0,
            loading: false,

            isLoading: true,
            currentTime: 0,
            duration: 0,
            isFullScreen: false,
            paused: false,
            playerState: PLAYER_STATES.PLAYING,
        }
    }

    // componentDidUpdate() {
    //     console.log('oiss');
    //     this.updateUser();
    // }

    // updateUser() {
    //     if (this.state.id !== this.props.item.id) {
    //         this.setState({
    //             id: this.props.item.id,
    //             name: this.props.item.name,
    //             photo: this.props.item.photo,
    //             videos: this.props.item.stories,

    //             videoIndex: 1,
    //             loading: false
    //         })
    //     }
    // }

    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };
    onReplay = () => {
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };
    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };
    onLoad = data => this.setState({ duration: data.duration, isLoading: false });
    onLoadStart = data => this.setState({ isLoading: true });

    onEnd = () => {
        this.setState({ playerState: PLAYER_STATES.ENDED });
    }

    onError = () => alert('Oh! ', error);
    exitFullScreen = () => {
        alert("Exit full screen");
    };
    onSeeking = currentTime => this.setState({ currentTime });

    onNextVideo = () => {
        let { videoIndex, videos } = this.state;
        this.setState({ videoIndex: videoIndex + 1 });
    }

    onPreviousVideo = () => {
        let { videoIndex, videos } = this.state;
        this.setState({ videoIndex: videoIndex - 1 });
    }
    // onVideoEnd = () => {
    //     let { videoIndex, videos } = this.state;
    //     console.log(videoIndex)
    //     console.log(videos.length)
    //     console.log('----------')
    //     if (videoIndex === (videos.length - 1)) {
    //         this.props.userStoriesEnded();
    //     } else {
    //         console.log('oi')
    //         this.setState({ videoIndex: videoIndex + 1 });
    //     }
    //     this.player.forceUpdate();

    // }

    render() {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image source={this.state.photo ? { uri: this.state.photo } : defaultAvatar} resizeMode='center' style={styles.avatar} />
                    </View>
                    <Text style={styles.text}>{this.state.name} {this.state.id}</Text>
                    <View style={{ width: '10%' }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>{this.state.videoIndex + 1}/{this.state.videos.length}</Text>
                    </View>
                </View>
                <Video source={{ uri: this.state.videos[this.state.videoIndex].media }}
                    resizeMode='contain'
                    onEnd={this.onEnd}
                    onLoad={this.onLoad}
                    onLoadStart={this.onLoadStart}
                    onProgress={this.onProgress}
                    paused={this.state.paused}
                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                    onFullScreen={this.state.isFullScreen}
                    style={styles.backgroundVideo}
                />
                <MediaControls
                    duration={this.state.duration}
                    isLoading={this.state.isLoading}
                    mainColor="#333"
                    onPaused={this.onPaused}
                    onReplay={this.onReplay}
                    onSeek={this.onSeek}
                    onSeeking={this.onSeeking}
                    playerState={this.state.playerState}
                    progress={this.state.currentTime}
                />
                <View style={{ position: 'absolute', flexDirection: 'row', top: '90%', justifyContent: 'space-between', width: WIDTH * 0.9, paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => this.onPreviousVideo()}><Text style={{ fontSize: 35, color: 'white' }}> {'<'} </Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onNextVideo()}><Text style={{ fontSize: 35, color: 'white' }}> {'>'} </Text></TouchableOpacity>
                </View>
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