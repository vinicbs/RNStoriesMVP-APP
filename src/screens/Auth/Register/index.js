import * as React from "react";
import {
    StyleSheet, Text, View, Alert, ActivityIndicator,
    TextInput, TouchableOpacity, Image, AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import Colors from "../../../utils/styles/Colors";
import { ROUTES } from "../../../config/routes";
import { CommonStyles, WIDTH, HEIGHT } from "../../../utils/styles/CommonStyles";
import Client from "../../../services/Client";
import defaultAvatar from '../../../assets/images/default-avatar.png'
import ImagePicker from 'react-native-image-picker';
import { requestCameraPermission } from '../../../utils/permissionsAndroid'
import { register } from "../../../services/auth";
import { registerErrors } from "../../../utils/errorHandling";

/**
 * The Login screen
 */
const options = {
    title: 'Selecionar foto',
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: 'Tirar foto...',
    chooseFromLibraryButtonTitle: 'Escolher da galeria...',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
export default class RegisterScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            photo: '',

            loading: false,
            registered: false,
        }
    }

    handlePhotoChange = () => {
        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                await requestCameraPermission();
                this.setState({ loading: true }, async () => {
                    let image = new FormData();
                    let fileName = response.fileName.replace(/[^a-zA-Z0-9\.]/g, "").replace(/ /g, '');
                    let imageType = response.type;
                    try {
                        if (!imageType) {
                            let fileTypeCheck = await fileType(response.path)
                            imageType = fileTypeCheck.mime;
                        }
                        image.append('image', { uri: response.uri, name: fileName, type: imageType });

                        let responseImage = await ApiYo.imageUpload(image);
                        console.log(responseImage);
                        const imageUrl = responseImage.link;

                    } catch (err) {
                        console.error(err);
                        this.setState({ loadingPhoto: false });
                    }
                });
                const source = { uri: response.uri };
                this.setState({
                    avatarSource: source,
                });
            }
        });
    }

    handleCreateAccount = async () => {
        this.setState({ loading: true }, async () => {
            const { email, name, password, passwordConfirm } = this.state;
            if ((email === '') || (password === '') || (name === '')) {
                Alert.alert('Aviso', 'Verifique os campos obrigatórios!');
                return this.setState({ loading: false });
            } else if (password !== passwordConfirm) {
                Alert.alert('Aviso', 'Senhas não coincidem');
                return this.setState({ loading: false });
            } else {
                try {
                    let registerResponse = await register({ email, name, password });
                    if (registerResponse.success) {
                        await Client.setTokenInHeader(token);
                        await AsyncStorage.setItem('userId', id.toString());
                        await AsyncStorage.setItem('userEmail', email);
                        await AsyncStorage.setItem('username', name);
                        await AsyncStorage.setItem('userPhoto', photo);
                        this.setState({ registered: true });
                    } else {
                        Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
                        return this.setState({ loading: false });
                    }
                } catch (err) {
                    console.log(err)
                    if (err.status >= 400 && err.status < 500) {
                        Alert.alert('Aviso', registerErrors(err));
                        return this.setState({ loading: false });
                    } else {
                        Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
                        return this.setState({ loading: false });
                    }
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>RNStoriesMVP</Text>
                {this.state.loading ?
                    <ActivityIndicator animating={true} size='large' color={'black'} /> :
                    this.state.registered ?
                        <TouchableOpacity style={[styles.avatar, {}]} onPress={() => this.handlePhotoChange()}>
                            <Image source={defaultAvatar} resizeMode='center' style={{ width: 150, height: 150, borderRadius: 100 }} />
                        </TouchableOpacity> :
                        <React.Fragment>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={CommonStyles.textField}
                                    placeholder="Email"
                                    autoCapitalize="none"
                                    autoCompleteType={"email"}
                                    underlineColorAndroid="transparent"
                                    onChange={e => this.setState({ email: e.nativeEvent.text })}>
                                </TextInput>
                                <TextInput
                                    style={CommonStyles.textField}
                                    placeholder="Nome"
                                    autoCapitalize="none"
                                    autoCompleteType={'name'}
                                    underlineColorAndroid="transparent"
                                    onChange={e => this.setState({ name: e.nativeEvent.text })}>
                                </TextInput>
                                <TextInput
                                    style={CommonStyles.textField}
                                    placeholder="Senha"
                                    autoCompleteType="password"
                                    autoCapitalize="none"
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={true}
                                    onChange={e => this.setState({ password: e.nativeEvent.text })}>
                                </TextInput>
                                <TextInput
                                    style={CommonStyles.textField}
                                    placeholder="Confirmar Senha"
                                    autoCompleteType="password"
                                    autoCapitalize="none"
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={true}
                                    onChange={e => this.setState({ passwordConfirm: e.nativeEvent.text })}>
                                </TextInput>
                                <TouchableOpacity style={CommonStyles.button} onPress={() => this.handleCreateAccount()}>
                                    <Text style={{ fontSize: 20 }}>Cadastrar</Text>
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: "center",
        backgroundColor: Colors.backgroundColor,
    },
    inputContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: "center",
        backgroundColor: Colors.backgroundColor
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    avatar: {
        borderWidth: 1,
        width: 150,
        height: 150,
        borderRadius: 100,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "black",
        shadowOffset: { width: 10, height: 10 }
    }
});