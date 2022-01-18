/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    ScrollView,
    Alert,
} from 'react-native';
import DiaryAppBar from '../components/Diary/DiaryAppBar';
import * as colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI, URI_IO } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import OptionsMenu from "../utils/OptionsMenu.js";
import timeAgo from '../utils/timeAgo';
import { windowWidth, windowHeight } from '../constants/dimensions';
import AutoHeightImage from 'react-native-auto-height-image';
import { Video, AVPlaybackStatus } from 'expo-av';


function DiaryScreen({ navigation }) {

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const onRefresh = React.useCallback(async () => {
        // setRefreshing(true);
        const response = await fetch(URI + 'posts/list', {
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
        // setRefreshing(false);

    }, []);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));
        console.log(user)

        const token = await AsyncStorage.getItem('token');
        setToken(token)
        const response = await fetch(URI + 'posts/list', {
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


        const postOptionIcon = (<Entypo name="dots-three-vertical" size={18} color="black" />)

        const editPost = () => {
            Alert.alert("edit");
        }

        const deletePost = () => {
            Alert.alert("delete");
        }
        const renderImages = () => {
            if (item.images.length) {
                let listUri = []
                for (let i of item.images) {
                    uri = URI_IO + "/files/" + i.fileName;
                    listUri.push(uri);
                }
                return (
                    <View>
                        <View style={styles.imageContainer}>
                            <AutoHeightImage height={windowHeight} width={windowWidth / 2} source={{ uri: listUri[0] }} />
                            <AutoHeightImage height={windowHeight} width={windowWidth / 2} source={{ uri: listUri[1] }} />
                        </View>
                        <View style={styles.imageContainer}>
                            <AutoHeightImage height={windowHeight} width={windowWidth / 2} source={{ uri: listUri[2] }} />
                            <AutoHeightImage height={windowHeight} width={windowWidth / 2} source={{ uri: listUri[3] }} />
                        </View>
                    </View>
                )
            }
        }

        return (
            <View style={styles.diaryContainer}>
                <View style={styles.diaryInfo}>
                    {/* {item.author.avatar == null ? (
                        <TouchableOpacity
                            onPress={() => {
                                if (item.user.id === user.uid) {
                                    navigation.navigate('MyProfileScreen');
                                } else {
                                    navigation.navigate('OtherProfileScreen', { other: item.user });
                                }
                            }}>
                            <Image
                                source={{ uri: item.user.avatar }}
                                style={styles.diaryImageAvatar}
                            />
                        </TouchableOpacity>
                    ) : ( */}
                    <TouchableOpacity
                        onPress={() => {
                            if (item.author._id == user.id) {
                                navigation.navigate('MyProfileScreen');
                            } else {
                                navigation.navigate('OtherProfileScreen', { other: item.author });
                            }
                        }}
                    >
                        <Image
                            source={{ uri: 'https://picsum.photos/200' }}
                            style={styles.diaryImageAvatar}
                        />
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.text2}>{item.author.username}</Text>
                        <Text style={styles.text3}>{timeAgo(new Date(item.createdAt))}</Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft: 240 }}>
                        <OptionsMenu
                            customButton={postOptionIcon}
                            buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
                            destructiveIndex={1}
                            options={["Ẩn bài viết", "Chặn bài viết", "Huỷ"]}
                            actions={[editPost, deletePost]} />
                    </TouchableOpacity>

                </View>
                <Text
                    style={{
                        fontFamily: item.font,
                        color: item.color,
                        fontSize: 24,
                        marginHorizontal: 15,
                    }}>
                    {item.described}
                </Text>
                {renderImages()}
                {/* {item.image !== null && (
                    <AutoHeightImage width={windowWidth} source={{ uri: item.image }} />
                )}
                {item.video !== null && (
                    <VideoPlayer
                        video={{
                            uri: item.video,
                        }}
                        videoWidth={windowWidth}
                        videoHeight={windowWidth}
                        thumbnail={{ uri: item.video }}
                    />
                )} */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.action}
                        onPress={handleLike}
                    >
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
                        }
                    >
                        <Ionicons
                            name="chatbox-ellipses-outline"
                            size={24}
                            color={colors.GREY_600}
                        />
                        <Text style={styles.textAction}>{item.countComments}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <DiaryAppBar navigation={navigation} />
                <FlatList
                    ListHeaderComponent={
                        <View style={styles.headerContainer}>
                            <Image
                                source={{ uri: 'https://picsum.photos/200' }}
                                style={styles.diaryImageAvatar}
                            />
                            <TouchableOpacity
                                onPress={() => navigation.navigate('PostDiaryScreen')}
                            >
                                <Text style={styles.text4}>Hôm nay bạn thế nào?</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    data={posts}
                    renderItem={renderItem}
                    extraData={refresh}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        flexDirection: 'row',
    },
    container: {
        backgroundColor: colors.BLUE_GREY_50,
        flex: 1,
    },
    diaryContainer: {
        backgroundColor: colors.WHITE,
        marginTop: 10,
    },
    diaryInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    diaryImageAvatar: {
        borderRadius: 20,
        height: 40,
        marginHorizontal: 20,
        width: 40,
    },
    diaryTextAvatar: {
        alignItems: 'center',
        backgroundColor: colors.LIGHT_BLUE_A400,
        borderRadius: 20,
        justifyContent: 'center',
        height: 40,
        marginHorizontal: 20,
        width: 40,
    },
    text1: {
        color: colors.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    text2: {
        color: colors.GREY_900,
        fontSize: 16,
        fontWeight: 'bold',
    },
    text3: {
        color: colors.BLUE_GREY_400,
        fontSize: 12,
    },
    actionsContainer: {
        alignItems: 'center',
        borderTopColor: colors.GREY_300,
        borderTopWidth: 0.75,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingVertical: 10,
    },
    action: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 24,
    },
    textAction: {
        color: colors.GREY_900,
        fontSize: 18,
        marginLeft: 5,
    },
    headerContainer: {
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        flexDirection: 'row',
        paddingVertical: 10,
    },
    text4: {
        color: colors.GREY_400,
        fontSize: 18,
    },
});

export default DiaryScreen;
