import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    NavigationScreenComponent,
    NavigationScreenProp,
    NavigationStackScreenOptions
} from "react-navigation";
import { ROUTES } from '../../config/routes';
import Client from "src/services/Client";
import { storiesList } from "src/services/stories";
import UserCard from 'src/components/Stories/UserCard'
import { CommonStyles, WIDTH, HEIGHT } from "../../utils/styles/CommonStyles";
import StoriesPlayer from "../../components/Stories/StoriesPlayer";
import Modal from 'react-native-modal';

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
                <TouchableOpacity style={CommonStyles.button} onPress={() => this.handleLogout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
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
    }
});