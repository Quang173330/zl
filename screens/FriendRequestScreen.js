import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import timeAgo from '../utils/timeAgo';
import * as colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { URI } from '../constants/config';
import FriendRequestAppBar from '../components/More/FriendRequestAppBar';
import { windowWidth } from '../constants/dimensions';

function FriendRequestScreen({ navigation }) {

    const [listRequests, setListRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));

        const token = await AsyncStorage.getItem('token');
        setToken(token)

        const response = await fetch(URI + 'friends/get-requested-friend', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
        });
        const res = await response.json();
        setListRequests(res.data.friends);
    }, []);


    const renderItem = ({ item }) => {
        const onAccept = async () => {
            const response = await fetch(URI + 'friends/set-accept', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    user_id: item._id,
                    is_accept: 1,
                })
            });
            const res = await response.json();
            console.log(res)
        }

        const onDenied = async () => {
            const response = await fetch(URI + 'friends/set-accept', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    user_id: item._id,
                    is_accept: 2,
                })
            });
            const res = await response.json();
            console.log(res)
        }

        return (
            <TouchableOpacity
            // onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, username: item.username })}
            >
                <View style={styles.conversationContainer}>
                    {item.avatar == null ? (
                        <Image source={{ uri: item.avatar }} style={styles.imageAvatar} />
                    ) : (
                        <View style={styles.textAvatar}>
                            <Text style={styles.text1}>{item.username}</Text>
                        </View>
                    )}
                    <View style={styles.divide}>
                        <View style={styles.messageContainer}>
                            <Text style={styles.text2}>{item.username}</Text>
                        </View>
                        <TouchableOpacity onPress={onAccept}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={[colors.LIGHT_BLUE_A700, colors.LIGHT_BLUE_A400]}
                                style={styles.buttonAccept}>
                                <Text style={styles.textButton}>Đồng ý</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDenied}>
                            <Ionicons style={styles.buttonDenied} color={colors.BLUE_GREY_400} size={34} name="close-outline" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FriendRequestAppBar navigation={navigation} />
            <View style={styles.conversationsContainer}>
                <FlatList
                    ListEmptyComponent={
                        <View>
                            <Image
                                source={require('../assets/images/norequest.jpg')}
                                style={styles.imageRequest}
                            />
                            <Text style={styles.textRequest}>Không có lời mời kết bạn nào</Text>
                        </View>
                    }
                    data={listRequests}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        flex: 1,
    },
    conversationsContainer: {
        flex: 1,
    },
    conversationContainer: {
        flexDirection: 'row',
    },
    imageAvatar: {
        borderRadius: 20,
        height: 40,
        margin: 15,
        width: 40,
    },
    textAvatar: {
        alignItems: 'center',
        backgroundColor: colors.LIGHT_BLUE_A400,
        borderRadius: 20,
        justifyContent: 'center',
        height: 40,
        margin: 15,
        width: 40,
    },
    text1: {
        color: colors.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    messageContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    text2: {
        marginTop: 5,
        color: colors.GREY_900,
        fontSize: 16,
    },
    text3: {
        color: colors.BLUE_GREY_400,
        fontSize: 12,
    },
    text4: {
        color: colors.BLUE_GREY_400,
        fontSize: 12,
        marginRight: 15,
    },
    divide: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    conversationsFooter: {
        alignItems: 'center',
    },
    textConversationsFooter: {
        color: colors.BLUE_GREY_400,
        fontSize: 14,
        marginVertical: 15,
    },
    button: {
        borderRadius: 30,
        paddingHorizontal: 32,
        paddingVertical: 8,
    },
    buttonAccept:{
        marginTop:15,
        justifyContent: 'center',
        borderRadius: 18,
        paddingHorizontal: 32,
        paddingVertical: 8,
    },
    buttonDenied:{
        marginTop:9,
        justifyContent: 'center',
        borderRadius: 18,
        paddingHorizontal: 22,
        paddingVertical: 8,
    },
    button1: {
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    textButton: {
        color: colors.WHITE,
        fontSize: 14,
    },
    imageRequest: {
        marginTop: 70,
        height: (windowWidth / 945) * 268,
        width: windowWidth,
    },
    textRequest: {
        marginTop: 25,
        color: colors.GREY_600,
        alignItems: 'center',
    }
});

export default FriendRequestScreen;
