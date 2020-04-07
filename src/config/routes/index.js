import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import StartScreen from '../../screens/Auth';
import HomeScreen from '../../screens/Home';
import LoginScreen from '../../screens/Auth/Login';
import RegisterScreen from '../../screens/Auth/Register';

export const ROUTES = {
	RootMain: "RootMain",
	StartScreen: "StartScreen",
	LoginScreen: "LoginScreen",
	RegisterScreen: "RegisterScreen",
	HomeScreen: "HomeScreen"
}

const MainStack = createStackNavigator({
	[ROUTES.StartScreen]: {
		screen: StartScreen
	},
	[ROUTES.LoginScreen]: {
		screen: LoginScreen
	},
	[ROUTES.RegisterScreen]: {
		screen: RegisterScreen
	},
	[ROUTES.HomeScreen]: {
		screen: HomeScreen
	}
})

const RootStack = createStackNavigator(
	{
		[ROUTES.RootMain]: {
			screen: MainStack
		}
	},
	{
		mode: "modal",
		headerMode: "none"
	}
)

const AppContainer = createAppContainer(RootStack);

export default AppContainer;