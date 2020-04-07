import * as React from "react";
import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import Colors from "../../../utils/styles/Colors";
import { CommonStyles } from "../../../utils/styles/CommonStyles";
import { login } from "../../../services/auth";
import Client from "../../../services/Client";
import { ROUTES } from "../../../config/routes";
/**
 * The Login screen
 */
export default class LoginScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',

            loading: false,
        }
    }

    handleButtonPress() {
        if ((this.state.email === '') || (this.state.password === '')) {
            Alert.alert('Aviso', 'Verifique os campos obrigatórios!');
        } else {
            this.setState({ loading: true }, async () => {
                try {
                    let authResponse = await login({ email: this.state.email, password: this.state.password });
                    if (authResponse.success) {
                        const { id, email, name, photo, token } = authResponse.data;
                        try {
                            await Client.setTokenInHeader(token);
                            await AsyncStorage.setItem('userId', id.toString());
                            await AsyncStorage.setItem('userEmail', email);
                            await AsyncStorage.setItem('username', name);
                            await AsyncStorage.setItem('userPhoto', photo);
                            return this.setState({ loading: false }, () => this.props.navigation.navigate(ROUTES.HomeScreen));
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
                    }
                } catch (err) {
                    if ('status' in err && err.status === 400) {
                        Alert.alert('Aviso', 'Usuário ou senha incorretos!');
                        return this.setState({ loading: false });
                    }
                    Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
                    return this.setState({ loading: false });
                }
            });
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ?
                    <ActivityIndicator animating={true} size='large' color={'black'} /> :
                    <React.Fragment>
                        <Text style={styles.title}>RNStoriesMVP</Text>
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
                                placeholder="Senha"
                                autoCompleteType="password"
                                autoCapitalize="none"
                                underlineColorAndroid="transparent"
                                secureTextEntry={true}
                                onChange={e => this.setState({ password: e.nativeEvent.text })}>
                            </TextInput>
                            <TouchableOpacity style={CommonStyles.button} onPress={() => this.handleButtonPress()}>
                                <Text style={{ fontSize: 20 }}>Entrar</Text>
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
        justifyContent: 'space-around',
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
    }
});