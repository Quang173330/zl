import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI,URI_IO } from '../constants/config';
import ChatAppBar from '../components/Message/ChatAppBar';
import { io } from "socket.io-client";

function ChatScreen({ navigation, route }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const flatlistRef = useRef();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    const socket = io(URI_IO)
    const sendMessage = async () => {
        // const response = await fetch(URI + 'chats/send', {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         authorization: "Bearer " + token,
        //     },
        //     body: JSON.stringify({
        //         type: "PRIVATE_CHAT",
        //         content: message,
        //         chatId: route.params.chatId
        //     })
        // });
        // const res = await response.json();
        socket.emit("newMessage", {
            type: "PRIVATE_CHAT",
            content: message,
            chatId: route.params.chatId,
            token: token,
        });
        setMessage('');
    };

    useEffect(async () => {
        socket.connect();
        socket.emit("join",route.params.chatId);
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const response = await fetch(URI + 'chats/getMessages/' + route.params.chatId, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
        });
        const res = await response.json();
        const messages = res.data
        await setMessages(messages);
        console.log(messages.length);
        socket.on("onmessage", (msg) => {
            messages.push(msg);
            setMessages(messages);
        });
    }, []);

    const renderItem = ({ item, index }) => {
        if (item.user._id === user.id) {
            return (
                <View style={styles.messageContainer1}>
                    <View style={styles.message1}>
                        <Text style={styles.text1}>{item.content}</Text>
                    </View>
                </View>
            );
        } else {
            let showAvatar = true;
            if (
                index > 0 &&
                messages[index - 1].user._id === messages[index].user._id
            ) {
                showAvatar = false;
            }

            return (
                <View style={styles.messageContainer2}>
                    {showAvatar ? (
                        !item.user.avatar ? (
                            <Image source={{ uri: item.user.avatar }} style={styles.imageAvatar} />
                        ) : (
                            <View style={styles.textAvatar}>
                                <Text style={styles.text3}>{item.user.username}</Text>
                            </View>
                        )
                    ) : (
                        <View style={styles.imageAvatar} />
                    )}
                    <View style={styles.message2}>
                        <Text style={styles.text1}>{item.content}</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <ChatAppBar navigation={navigation} user={route.params.username} socket={socket} />
            <View style={styles.messagesContainer}>
                <FlatList data={messages} renderItem={renderItem} ref={flatlistRef} />
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.icon}>
                    <Ionicons name="happy-outline" size={28} color={colors.GREY_600} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Tin nhắn"
                    style={styles.input}
                    value={message}
                    onChangeText={text => setMessage(text)}
                />
                {message === '' ? (
                    <>
                        <TouchableOpacity style={styles.icon}>
                            <Ionicons
                                name="ellipsis-horizontal-outline"
                                size={28}
                                color={colors.GREY_600}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.icon}>
                            <Ionicons name="mic-outline" size={28} color={colors.GREY_600} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.icon}>
                            <Ionicons
                                name="image-outline"
                                size={28}
                                color={colors.GREY_600}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.icon} onPress={sendMessage}>
                        <Ionicons name="send" size={28} color={colors.LIGHT_BLUE_A700} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.INDIGO_50,
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom:3,
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        flexDirection: 'row',
    },
    input: {
        color: colors.GREY_900,
        flex: 1,
        fontSize: 18,
    },
    icon: {
        marginHorizontal: 10,
    },
    messageContainer1: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 4,
    },
    message1: {
        backgroundColor: colors.LIGHT_BLUE_50,
        borderRadius: 10,
        marginRight: 15,
        maxWidth: '65%',
        padding: 10,
    },
    text1: {
        color: colors.GREY_900,
        fontSize: 16,
    },
    messageContainer2: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    imageAvatar: {
        borderRadius: 15,
        height: 30,
        marginLeft: 15,
        marginRight: 5,
        width: 30,
    },
    textAvatar: {
        alignItems: 'center',
        backgroundColor: colors.LIGHT_BLUE_A400,
        borderRadius: 15,
        justifyContent: 'center',
        height: 30,
        marginLeft: 15,
        marginRight: 5,
        width: 30,
    },
    text3: {
        color: colors.WHITE,
        fontSize: 14,
    },
    message2: {
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        marginRight: 15,
        maxWidth: '65%',
        padding: 10,
    },
});

export default ChatScreen;
