import { PermissionsAndroid } from "react-native";

export const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "RNStoriesMVP",
                message:
                    "RNStoriesMVP precisa de acesso a sua camera ",
                buttonNeutral: "Perguntar depois",
                buttonNegative: "Cancelar",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted')
        } else {
            console.log('Permission denied')
        }
    } catch (err) {
        console.log('Error')
    }
};
