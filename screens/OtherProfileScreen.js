/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { windowHeight, windowWidth } from '../constants/dimensions';
import timeAgo from '../utils/timeAgo';
import * as colors from '../constants/colors';
import OtherProfileAppBar from '../components/More/OtherProfileAppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI } from '../constants/config';

function OtherProfileScreen({ navigation, route }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token)
        const userResponse = await fetch(URI + 'users/show/' +route.params.other._id, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,

            },
        });
        const userResult = await userResponse.json();
        setUser(userResult.data)
        const response = await fetch(URI + 'posts/list?userId=' + route.params.other._id, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
        });
        const res = await response.json();
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setPosts(res.data);
    }, []);

    const renderItem = ({ item }) => {
        const handleLike = async () => {
            const response = await fetch(URI + 'postLike/action/' + item._id, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify(),
            });
            const res = await response.json();
            item.isLike = !item.isLike
            item.like = res.data.like
            setPosts(posts)
            setRefresh(!refresh)
        };


        return (
            <View style={styles.diaryContainer}>
                <Text style={styles.diaryTime}>{timeAgo(new Date(item.createdAt))}</Text>
                <View style={styles.diary}>
                    <Text
                        style={{ fontSize: 24 }}>
                        {item.described}
                    </Text>
                    {/* {item.images !== null && (
                        <AutoHeightImage
                            width={windowWidth - 70}
                            source={{ uri: item.image }}
                        />
                    )}
                    {item.videos !== null && (
                        <VideoPlayer
                            video={{
                                uri: item.video,
                            }}
                            videoWidth={windowWidth - 70}
                            videoHeight={windowWidth - 70}
                            thumbnail={{ uri: item.video }}
                        />
                    )} */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.action} onPress={handleLike}>
                            <Ionicons
                                name={item.isLike ? 'heart' : 'heart-outline'}
                                size={24}
                                color={item.isLike ? colors.RED_600 : colors.GREY_600}
                            />
                            <Text style={styles.textAction}>{item.like.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.action}
                            onPress={() =>
                                navigation.navigate('CommentScreen', { postId: item._id })
                            }>
                            <Ionicons
                                name="chatbox-ellipses-outline"
                                size={24}
                                color={colors.GREY_600}
                            />
                            <Text style={styles.textAction}>{item.countComment}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <OtherProfileAppBar
                navigation={navigation}
                user={{
                    avatar: route.params.other.avatar,
                    username: route.params.other.username,
                }}
            />
            <FlatList
                ListEmptyComponent={
                    <Text style={styles.text4}>
                        {`${route.params.other.username} chưa có hoạt động nào. Hãy trò chuyện để hiểu nhau hơn.`}
                    </Text>
                }
                ListHeaderComponent={
                    <>
                        <View style={styles.backgroundImageContainer}>
                            <Image
                                source={{
                                    uri: 'https://picsum.photos/1000',
                                }}
                                style={styles.backgroundImage}
                            />
                        </View>
                        <View style={styles.avatarContainer}>
                            {route.params.other.avatar != null ? (
                                <Image
                                    source={{ uri: route.params.other.avatar }}
                                    style={styles.imageAvatar}
                                />
                            ) : (
                                <View style={styles.textAvatar}>
                                    <Text style={styles.text1}>{route.params.other.username}</Text>
                                </View>
                            )}
                            <Text style={styles.text2}>{route.params.other.username}</Text>
                        </View>
                    </>
                }
                data={posts}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImageContainer: {
        backgroundColor: colors.GREY_300,
    },
    backgroundImage: {
        height: windowHeight / 4,
        width: windowWidth,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 15,
        marginTop: -windowWidth / 6,
    },
    imageAvatar: {
        borderColor: colors.WHITE,
        borderRadius: windowWidth / 6,
        borderWidth: 3,
        height: windowWidth / 3,
        width: windowWidth / 3,
    },
    textAvatar: {
        alignItems: 'center',
        backgroundColor: colors.LIGHT_BLUE_A400,
        borderColor: colors.WHITE,
        borderRadius: windowWidth / 6,
        borderWidth: 3,
        justifyContent: 'center',
        height: windowWidth / 3,
        width: windowWidth / 3,
    },
    text1: {
        color: colors.WHITE,
        fontSize: 60,
        fontWeight: 'bold',
    },
    text2: {
        color: colors.GREY_900,
        fontSize: 24,
        fontWeight: 'bold',
    },
    diaryContainer: {
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 10,
    },
    diaryTime: {
        alignSelf: 'flex-start',
        backgroundColor: colors.BLUE_GREY_100,
        borderRadius: 5,
        color: colors.GREY_900,
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 1,
    },
    diary: {
        backgroundColor: colors.WHITE,
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        marginTop: 10,
    },
    actionsContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    action: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 25,
    },
    textAction: {
        color: colors.GREY_900,
        fontSize: 18,
        marginLeft: 5,
    },
    text4: {
        color: colors.BLUE_GREY_400,
        fontSize: 14,
        marginHorizontal: 50,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default OtherProfileScreen;
