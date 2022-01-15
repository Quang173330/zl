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
        if(phonenumber === '') {
            Alert.alert("Vui lòng nhập số điện thoại");
            return;
        }
        if(password === '') {
            Alert.alert("Vui lòng nhập mật khẩu");
            return;
        }
        if(!phonenumber.match(/^\d{10}$/)) {
            Alert.alert("Vui lòng nhập số điện thoại đúng định dạng.");
            return;
        }
        if(!password.match(/^[0-9a-zA-Z]{6,}$/)) {
            Alert.alert("Vui lòng nhập mật khẩu đúng định dạng.");
            return;
        }
        // const response = await fetch(URI+ 'users/login', {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         phonenumber: phonenumber,
        //         password: password,
        //     }),
        // });
        // const res = await response.json()
        // const user = JSON.stringify(res.data)
        // AsyncStorage.setItem('user', user);
        // const a = await AsyncStorage.getItem('user')
        // console.log(typeof a)
        // AsyncStorage.setItem('token', res.token);
        // navigation.navigate('MainScreen');
        // Alert.alert('Đăng nhập thành công');
        fetch(URI+ 'users/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phonenumber: phonenumber,
                password: password,
            }),
        }).then((response) => {
            return {response: response.json(), status: response.status}
        })
        .then((res) => {
            if(res.status === 400) {
                Alert.alert("Tài khoản hoặc mật khẩu không đúng.");    
            } else {
                const user = JSON.stringify(res.response.data);
                AsyncStorage.setItem('user', user);
                AsyncStorage.getItem('user');
                AsyncStorage.setItem('token', res.token);
                navigation.navigate('MainScreen');
                Alert.alert('Đăng nhập thành công');
            }
        })
        .catch((error) => {
            console.error(error);
        });
        
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