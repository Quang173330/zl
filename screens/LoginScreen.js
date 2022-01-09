import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Alert } from "react-native";
import { URI } from '../constants/config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LogInScreen({ navigation }) {
    const [phonenumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const onLogin = async () => {
        const response = await fetch('http://0e19-116-97-107-146.ngrok.io/api/v1/users/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phonenumber: phonenumber,
                password: password,
            }),
        });
        const res = await response.json()
        AsyncStorage.setItem('token', res.token);
        navigation.navigate('MainScreen');
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.textTitle}>
                    VUi lòng nhập số điện thoại và mật khẩu để đăng nhậ.
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Số điện thoại"
                    autoFocus={true}
                    style={styles.input}
                    value={phonenumber}
                    onChangeText={text => setPhoneNumber(text)}
                />
                <TextInput
                    placeholder="Mật khẩu"
                    secureTextEntry={true}
                    style={styles.input}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onLogin}
                >
                    <FontAwesome5 name={'arrow-right'} size={16} color={colors.WHITE} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        flex: 1,
    },
    title: {
        marginTop: 35,
        backgroundColor: '#ECEFF1',
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    textTitle: {
        color: colors.GREY_900,
        fontSize: 12,
    },
    inputContainer: {
        marginTop: 35,
        paddingHorizontal: 15,
    },
    input: {
        borderBottomColor: colors.CYAN_400,
        borderBottomWidth: 2,
        color: colors.GREY_900,
        fontSize: 16,
        height: 44,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'flex-end',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    button: {
        backgroundColor: colors.LIGHT_BLUE_A700,
        borderRadius: 40,
        paddingHorizontal: 17,
        paddingVertical: 15,

        elevation: 11,
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
    },
});

export default LogInScreen;