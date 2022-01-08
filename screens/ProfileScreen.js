import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VideoPlayer from 'react-native-video-player';
import {useSelector} from 'react-redux';
import {windowHeight, windowWidth} from '/../constants/dimensions';
import timeAgo from '../../utils/timeAgo';
import * as colors from '../constants/colors';
import MyProfileAppBar from './MyProfileAppBar';

function ProfileScreen({navigation}) {
  const user = useSelector(state => state.myauth.user);

  const [modalVisible, setModalVisible] = useState(false);

  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const unsubscriber = firestore()
      .collection('Diaries')
      .onSnapshot(querySnapshot => {
        const newDiaries = [];

        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().user.id === user.uid) {
            newDiaries.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }
        });

        newDiaries.sort((a, b) => b.created - a.created);

        setDiaries(newDiaries);
      });

    return () => unsubscriber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLauchCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
      },
      response => {
        setModalVisible(false);

        if (!response.didCancel && !response.errorCode) {
          navigation.navigate('UploadAvatarScreen', {uri: response.uri});
        }
      },
    );
  };

  const handleLaunchImageLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        setModalVisible(false);

        if (!response.didCancel && !response.errorCode) {
          navigation.navigate('UploadAvatarScreen', {uri: response.uri});
        }
      },
    );
  };

  const renderItem = ({item}) => {
    const likedIndex = item.likes.findIndex(value => value === user.uid);
    const liked = likedIndex === -1 ? false : true;

    const handleLike = () => {
      let newLikes = [...item.likes];

      if (liked) {
        newLikes.splice(likedIndex, 1);
      } else {
        newLikes.push(user.uid);
      }

      firestore().collection('Diaries').doc(item.key).update({
        likes: newLikes,
      });
    };

    return (
      <View style={styles.diaryContainer}>
        <Text style={styles.diaryTime}>{timeAgo(item.created)}</Text>
        <View style={styles.diary}>
          <Text
            style={{fontFamily: item.font, color: item.color, fontSize: 24}}>
            {item.text}
          </Text>
          {item.image !== null && (
            <AutoHeightImage
              width={windowWidth - 70}
              source={{uri: item.image}}
            />
          )}
          {item.video !== null && (
            <VideoPlayer
              video={{
                uri: item.video,
              }}
              videoWidth={windowWidth - 70}
              videoHeight={windowWidth - 70}
              thumbnail={{uri: item.video}}
            />
          )}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.action} onPress={handleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? colors.RED_600 : colors.GREY_600}
              />
              <Text style={styles.textAction}>{item.likes.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.action}
              onPress={() =>
                navigation.navigate('CommentScreen', {diaryId: item.key})
              }>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color={colors.GREY_600}
              />
              <Text style={styles.textAction}>{item.comments.length}</Text>
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
              source={require('./../../../assets/images/change_avatar.jpg')}
              style={styles.changeAvatar}
            />
            <Text style={styles.text1Modal}>Ảnh đại diện</Text>
            <TouchableOpacity
              style={styles.modalLine}
              onPress={handleLauchCamera}>
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
              onPress={handleLaunchImageLibrary}>
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
              source={require('./../../../assets/images/profile1.jpg')}
              style={styles.imageProfile}
            />
            <Text
              style={
                styles.text3
              }>{`Hôm nay ${user.displayName} có gì vui?`}</Text>
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
              {user.photoURL != null ? (
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Image
                    source={{uri: user.photoURL}}
                    style={styles.imageAvatar}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <View style={styles.textAvatar}>
                    <Text style={styles.text1}>{user.displayName[0]}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <Text style={styles.text2}>{user.displayName}</Text>
            </View>
            <TouchableOpacity
              style={styles.postDiary}
              onPress={() => navigation.navigate('PostDiaryScreen')}>
              <Text style={styles.textPostDiary}>Bạn đang nghĩ gì?</Text>
            </TouchableOpacity>
          </>
        }
        data={diaries}
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
    marginLeft: 30,
    marginRight: 10,
    marginVertical: 15,
    padding: 10,
  },
  textPostDiary: {
    color: colors.BLUE_GREY_300,
    fontSize: 16,
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

export default ProfileScreen;