import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import { ROUTES } from '../../config/routes';
import Client from "src/services/Client";
import { storiesList, uploadStories } from "src/services/stories";
import UserCard from 'src/components/Stories/UserCard'
import { CommonStyles, WIDTH, HEIGHT } from "../../utils/styles/CommonStyles";
import StoriesPlayer from "../../components/Stories/StoriesPlayer";
import Modal from 'react-native-modal';
import ImagePicker, { ImagePickerOptions } from 'react-native-image-picker';
import { requestCameraPermission } from "../../utils/permissionsAndroid";
import { ProcessingManager } from 'react-native-video-processing';
import fileType from 'react-native-file-type';

/**
 * The Home screen
 */
const videoOptions = {
    title: 'Selecionar foto',
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: 'Tirar foto...',
    chooseFromLibraryButtonTitle: 'Escolher da galeria...',
    mediaType: 'video',
    videoQuality: 'low',
    durationLimit: 10,
    storageOptions: {
        skipBackup: true,
        path: 'videos',
    },
};
const imageOptions = {
    title: 'Selecionar foto',
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: 'Tirar foto...',
    chooseFromLibraryButtonTitle: 'Escolher da galeria...',
    mediaType: 'photo',
    quality: 0.5,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
}
export default class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            usersStories: [],

            selectedUser: 0,
            isModalPlayerVisible: false,
            page: 0,
        }
    }

    async handleLogout() {
        try {
            await Client.logout();
            return this.props.navigation.navigate(ROUTES.StartScreen)
        } catch (err) {
            Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
        }
    }

    componentDidMount = async () => {
        this.setState({ loading: true }, async () => {
            try {
                let storiesResult = await storiesList(this.state.page, 10);
                if (storiesResult.success) {
                    this.setState({ usersStories: storiesResult.data.results }, () => this.setState({ loading: false }))
                } else {
                    this.setState({ loading: false })
                }
            } catch (err) {
                console.log(err)
                this.setState({ loading: false })
            }
        })
    }

    handleUserCardClick = (index) => {
        this.setState({ isModalPlayerVisible: true, selectedUser: index });
    }

    handleChangeSelectedUser = () => {
        let { selectedUser } = this.state;
        console.log(selectedUser)
        console.log('debug 1')
        if (selectedUser === (storiesList.length - 1)) {
            this.setState({ selectedUser: 0, isModalPlayerVisible: false })
        } else {
            this.setState({ selectedUser: selectedUser + 1 })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Home Screen</Text>
                <ScrollView style={styles.storiesContainer}>
                    {this.state.loading ?
                        <ActivityIndicator animating={true} size='large' color={'black'} /> :
                        <FlatList ref={'storiesList'}
                            data={this.state.usersStories}
                            extraData={this.state}
                            // keyExtractor={this._keyExtractor}
                            renderItem={(item) => { return <UserCard item={item.item} index={item.index} onCardClick={this.handleUserCardClick} /> }}
                            ItemSeparatorComponent={() => <View style={{ marginBottom: 25, marginTop: 20 }} />}
                            // initialNumToRender={5}
                            ListFooterComponent={() => <View style={{ height: 30 }} />}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ fontSize: 18, color: 'black' }}>
                                            Nenhum stories disponivel
                                        </Text>
                                    </View>
                                );
                            }}
                        // refreshing={this.state.refreshing_general}
                        // onRefresh={() => this.handleRefreshGeneral()}
                        />
                    }
                </ScrollView>
                <View style={styles.buttonBox}>
                    <TouchableOpacity style={[CommonStyles.button, { width: '40%' }]} onPress={() => this.handleAddPhoto()}>
                        <Text>ADICIONAR FOTO</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[CommonStyles.button, { width: '40%' }]} onPress={() => this.handleAddVideo()}>
                        <Text>ADICIONAR VIDEO</Text>
                    </TouchableOpacity>
                </View>

                <Modal isVisible={this.state.isModalPlayerVisible}
                    hideModalContentWhileAnimating={false}
                    style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: HEIGHT * 0.2 }}
                    onBackdropPress={() => this.setState({ isModalPlayerVisible: false })}
                >
                    <StoriesPlayer
                        item={this.state.usersStories[this.state.selectedUser]}
                        userStoriesEnded={this.handleChangeSelectedUser}
                    />
                </Modal>
            </View>
        )
    }

    handleAddVideo = () => {
        ImagePicker.launchCamera(videoOptions, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                await requestCameraPermission();
                this.setState({ loading: true }, async () => {
                    let imageType = response.type;
                    try {
                        if (!imageType) {
                            let fileTypeCheck = await fileType(response.path)
                            imageType = fileTypeCheck.mime;
                        }
                        const compressOptions = {
                            width: 720,
                            bitrateMultiplier: 3,
                            minimumBitrate: 300000,
                        };
                        let t0 = Date.now()
                        let newSource = await ProcessingManager.compress(response.path, compressOptions)
                        let t1 = Date.now()
                        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
                        let uploadResult = await uploadStories(newSource.source, imageType)
                        console.log(uploadResult)
                        this.setState({ loading: false })
                    } catch (err) {
                        console.log(err)
                        Alert.alert('Aviso', 'Erro ao subir foto');
                        this.setState({ loading: false });
                    }
                });
            }
        });
    }

    handleAddPhoto = () => {
        ImagePicker.launchCamera(imageOptions, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                await requestCameraPermission();
                this.setState({ loading: true }, async () => {
                    let imageType = response.type;
                    try {
                        if (!imageType) {
                            let fileTypeCheck = await fileType(response.path)
                            imageType = fileTypeCheck.mime;
                        }
                        let uploadResult = await uploadStories(response.uri, imageType)
                        console.log(uploadResult)
                        this.setState({ loading: false })
                    } catch (err) {
                        console.log(err)
                        Alert.alert('Aviso', 'Erro ao subir foto');
                        this.setState({ loading: false });
                    }
                });
            }
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    storiesContainer: {
        flex: 1,
        width: '100%'
    },
    title: {
        padding: 20,
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    buttonBox: {
        flexDirection: 'row'
    }
});