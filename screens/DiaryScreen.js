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
} from 'react-native';
import DiaryAppBar from '../components/Diary/DiaryAppBar';
import * as colors from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URI } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

function DiaryScreen({ navigation }) {

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const token = await AsyncStorage.getItem('token');
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
        setRefreshing(false);

    }, []);

    useEffect(async () => {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));

        const token = await AsyncStorage.getItem('token');
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
        console.log(posts);
    }, []);
    const renderItem = ({ item }) => {

        // const handleLike = () => {
        //     let newLikes = [...item.likes];

        //     if (liked) {
        //         newLikes.splice(likedIndex, 1);
        //     } else {
        //         newLikes.push(user.uid);
        //     }

        //     firestore().collection('Diaries').doc(item.key).update({
        //         likes: newLikes,
        //     });
        // };

        return (
            <View style={styles.diaryContainer}>
                <View style={styles.diaryInfo}>
                    {/* {item.author.avatar == null ? (
                        <Text>Hello</Text>
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
                    // onPress={() => {
                    //     if (item.author.id === user.uid) {
                    //         navigation.navigate('MyProfileScreen');
                    //     } else {
                    //         navigation.navigate('OtherProfileScreen', { other: item.user });
                    //     }
                    // }}
                    >
                        <View style={styles.diaryTextAvatar}>
                            <Text style={styles.text1}>{item.author.username}</Text>
                        </View>
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.text2}>{item.author.username}</Text>
                        {/* <Text style={styles.text3}>{timeAgo(item.createdAt)}</Text> */}
                    </View>
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
                    // onPress={handleLike}
                    >
                        <Ionicons
                            name={item.isLike ? 'heart' : 'heart-outline'}
                            size={24}
                            color={item.isLike ? colors.RED_600 : colors.GREY_600}
                        />
                        <Text style={styles.textAction}>{item.like.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    // style={styles.action}
                    // onPress={() =>
                    //     navigation.navigate('CommentScreen', { diaryId: item.key })
                    // }
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
                            <View style={styles.diaryTextAvatar}>
                                <Text style={styles.text1}>Le Xuan Quang</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('PostDiaryScreen')}
                            >
                                <Text style={styles.text4}>Hôm nay bạn thế nào?</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    data={posts}
                    renderItem={renderItem}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
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
