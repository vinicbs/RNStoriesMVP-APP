import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, AsyncStorage } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import Colors from "../../utils/styles/Colors";
import { ROUTES } from "../../config/routes";
import Client from "../../services/Client";
import { refreshToken } from "../../services/auth";
import { CommonStyles } from "../../utils/styles/CommonStyles";

/**
 * The Start screen
 */
export default class StartScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
        }
    }

    async componentDidMount() {
        this.listener = this.props.navigation.addListener(
            'willFocus',
            data => {
                this.setState({ loading: false }, () => {
                    this.verifyToken();
                })
            }
        );
    }

    async verifyToken() {
        this.setState({ loading: true }, async () => {
            let authToken = await Client.getUserToken();
            if (authToken) {
                await Client.setTokenInHeader(authToken)
                try {
                    let refreshResponse = await refreshToken(authToken);
                    const { id, email, name, photo, token } = refreshResponse.data;
                    await Client.setTokenInHeader(token);
                    await AsyncStorage.setItem('userId', id.toString());
                    await AsyncStorage.setItem('userEmail', email);
                    await AsyncStorage.setItem('username', name);
                    await AsyncStorage.setItem('userPhoto', photo);
                    return this.setState({ loading: false }, () => this.props.navigation.navigate(ROUTES.HomeScreen));
                } catch (err) {
                    return this.setState({ loading: false });
                }
            } else {
                return this.setState({ loading: false });
            }
        });
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ?
                    <ActivityIndicator animating={true} size='large' color={'black'} /> :
                    <React.Fragment>
                        <Text style={styles.title}>RNStoriesMVP</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={CommonStyles.button} onPress={() => this.props.navigation.navigate(ROUTES.LoginScreen)}>
                                <Text>Entrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={CommonStyles.button} onPress={() => this.props.navigation.navigate(ROUTES.RegisterScreen)}>
                                <Text>Criar conta</Text>
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
    buttonContainer: {
        width: '100%',
        height: '25%',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: Colors.backgroundColor
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
});