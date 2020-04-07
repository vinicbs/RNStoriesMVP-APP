import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import { ROUTES } from "../../config/routes";
import { CommonStyles } from "../../utils/styles/CommonStyles";
import Client from "../../services/Client";

/**
 * The Home screen
 */
export default class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        header: null
    });

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    async handleLogout() {
        try {
            await Client.logout();
            return this.props.navigation.navigate(ROUTES.StartScreen)
        } catch(err) {
            Alert.alert('Aviso', 'Erro de servidor! Tente novamente mais tarde.');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Home Screen</Text>
                <TouchableOpacity style={CommonStyles.button} onPress={() => this.handleLogout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    }
});