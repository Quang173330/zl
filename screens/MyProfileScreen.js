/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { windowHeight, windowWidth } from '../constants/dimensions';
import timeAgo from '../utils/timeAgo';
import * as colors from '../constants/colors';
import MyProfileAppBar from '../components/More/MyProfileAppBar';
import { URI } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [token, setToken] = useState(null);
    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token)
        const userResponse = await fetch(URI + 'users/show', {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,

            },
        });
        const userResult = await userResponse.json();
        setUser(userResult.data)
        console.log('user', user)
        const response = await fetch(URI + 'posts/list?userId=' + user?._id, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,

            },
        });
        const res = await response.json();
        await res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                        <Text style={styles.text1Modal}>Tùy chọn</Text>
                            <TouchableOpacity
                                style={styles.modalLine}
                            // onPress={handleLauchCamera}
                            >
                                <Ionicons
                                    name="pencil-outline"
                                    size={28}
                                    color={colors.BLUE_500}
                                    style={styles.modalIcon}
                                />
                                <Text style={styles.text2Modal}>Chỉnh sửa bài đăng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalLine}
                            // onPress={handleLaunchImageLibrary}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={28}
                                    color={colors.BLUE_500}
                                    style={styles.modalIcon}
                                />
                                <Text style={styles.text2Modal}>Xóa bài đăng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelModal}
                                onPress={() => setModalVisible1(false)}>
                                <Text style={styles.text2Modal}>HỦY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Text style={styles.diaryTime}>{timeAgo(new Date(item.createdAt))}</Text>
                <View style={styles.diary}>
                    <Text
                        style={{ fontFamily: item.font, color: item.color, fontSize: 24 }}>
                        {item.described}
                    </Text>
                    {/* {item.image !== null && (
                        <AutoHeightImage
                            width={windowWidth - 70}
                            source={{ uri: item.image }}
                        />
                    )}
                    {item.video !== null && (
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
                                size={18}
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
                                size={18}
                                color={colors.GREY_600}
                            />
                            <Text style={styles.textAction}>{item.countComments}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.action1}
                        >
                            <Ionicons
                                name="earth"
                                size={18}
                                color={colors.GREY_600}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.action1}
                            onPress={() => {
                                setModalVisible1(true);
                            }}
                        >
                            <Ionicons
                                name="ellipsis-horizontal"
                                size={18}
                                color={colors.GREY_600}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Image
                            source={require('../assets/images/change_avatar.jpg')}
                            style={styles.changeAvatar}
                        />
                        <Text style={styles.text1Modal}>Ảnh đại diện</Text>
                        <TouchableOpacity
                            style={styles.modalLine}
                        // onPress={handleLauchCamera}
                        >
                            <Ionicons
                                name="camera-outline"
                                size={28}
                                color={colors.BLUE_500}
                                style={styles.modalIcon}
                            />
                            <Text style={styles.text2Modal}>Chụp ảnh mới</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalLine}
                        // onPress={handleLaunchImageLibrary}
                        >
                            <Ionicons
                                name="image-outline"
                                size={28}
                                color={colors.BLUE_500}
                                style={styles.modalIcon}
                            />
                            <Text style={styles.text2Modal}>Chọn ảnh từ thiết bị</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelModal}
                            onPress={() => setModalVisible(false)}>
                            <Text style={styles.text2Modal}>HỦY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <MyProfileAppBar navigation={navigation} user={user} />
            <FlatList
                ListEmptyComponent={
                    <>
                        <Image
                            source={require('../assets/images/profile1.jpg')}
                            style={styles.imageProfile}
                        />
                        <Text
                            style={
                                styles.text3
                            }>{`Hôm nay ${user?.username} có gì vui?`}</Text>
                        <Text style={styles.text4}>
                            Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc
                            đời và kỷ niệm đáng nhớ nhé!
                        </Text>
                    </>
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
                            {user?.photoURL != null ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}>
                                    <Image
                                        source={{ uri: user?.photoURL }}
                                        style={styles.imageAvatar}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(true);
                                    }}>
                                    <View style={styles.textAvatar}>
                                        <Text style={styles.text1}>{user?.username}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <Text style={styles.text2}>{user?.username}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.postDiary}
                            onPress={() => navigation.navigate('PostDiaryScreen')}>
                            <Text style={styles.textPostDiary}>Bạn đang nghĩ gì?</Text>
                        </TouchableOpacity>
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
    modalContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
    },
    changeAvatar: {
        height: windowWidth * (284 / 1080),
        width: windowWidth * (750 / 1080),
    },
    text1Modal: {
        alignSelf: 'flex-start',
        color: colors.GREY_900,
        fontSize: 18,
        fontWeight: 'bold',
        margin: 15,
    },
    modalLine: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        paddingVertical: 8,
    },
    modalIcon: {
        marginHorizontal: 15,
    },
    text2Modal: {
        color: colors.GREY_900,
        fontSize: 18,
        paddingHorizontal: 15,
    },
    cancelModal: {
        alignSelf: 'flex-end',
        margin: 15,
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
    postDiary: {
        backgroundColor: colors.WHITE,
        marginLeft: 20,
        marginRight: 20,
        marginVertical: 15,
        padding: 10,
    },
    textPostDiary: {
        color: colors.BLUE_GREY_300,
        fontSize: 16,
    },
    diaryContainer: {
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
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
    action1: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 25,

    },
    textAction: {
        color: colors.GREY_900,
        fontSize: 18,
        marginLeft: 5,
    },
    imageProfile: {
        height: (windowWidth / 1080) * 402,
        width: windowWidth,
    },
    text3: {
        color: colors.GREY_900,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text4: {
        color: colors.BLUE_GREY_400,
        fontSize: 14,
        marginHorizontal: 50,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default MyProfileScreen;
