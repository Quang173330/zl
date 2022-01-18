import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';
import { Ionicons } from '@expo/vector-icons';
import { windowWidth } from '../constants/dimensions';
import * as colors from '../constants/colors';
import * as MediaLibrary from "expo-media-library";
import { URI } from '../constants/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { Video, AVPlaybackStatus } from 'expo-av';



function PostDiaryScreen({ navigation }) {

  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const video = useRef(null);

  const [color, setColor] = useState('#FFB300');

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [user, setUser] = useState({});
  const [tab, setTab] = useState('');
  useEffect(async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(JSON.parse(user));
    const res = await MediaLibrary.requestPermissionsAsync()
    if (res.granted) {
      MediaLibrary
        .getAssetsAsync({ first: 6, mediaType: "photo" })
        .then((result) => {
          setImages(result.assets);
        });
    }
    if (res.granted) {
      MediaLibrary
        .getAssetsAsync({ first: 3, mediaType: "video" })
        .then((result) => {
          setVideos(result.assets);
        });
    }
  }, []);

  const handleBack = () => {
    if (text || selectedImages || selectedVideos) {
      Alert.alert(null, 'Nội dung chưa được lưu. Bạn có chắc muốn hủy?', [
        {
          text: 'KHÔNG',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'CÓ', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    let postImages = []
    if (selectedImages.length) {
      for (let item of selectedImages) {
        let myAssetId = item.uri.slice(5);
        let returnedAssetInfo = await MediaLibrary.getAssetInfoAsync(
          myAssetId
        );
        console.log('local uri', returnedAssetInfo.localUri);
        const base64 = await FileSystem.readAsStringAsync(
          returnedAssetInfo.localUri,
          { encoding: "base64" }
        );
        let image = "data:image/jpeg;base64," + base64
        postImages.push(image);
      }
    }
    const response = await fetch(URI + 'posts/create', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,

      },
      body: JSON.stringify({
        described: text,
        images: postImages
      }),
    });
    console.log('2')
    const res = await response.json();
    console.log(res.data)
    console.log('3')
    navigation.goBack();
  }
  const renderSelectedImages = () => {
    console.log(selectedImages)
    if (selectedImages.length > 0) {
      return (
        <View style={styles.image_wdyt_box_container}>
          {selectedImages.length <= 2 ? (
            <Image
              style={styles.upload_images}
              source={{ width: 50 + "%", height: 160, uri: selectedImages[0].uri }}
            />
          ) : selectedImages.length == 3 ? (
            <Image
              style={styles.upload_images}
              source={{ width: 66.66 + "%", height: 223, uri: selectedImages[0].uri }}
            />
          ) : selectedImages.length == 4 ? (
            <Image
              style={styles.upload_images}
              source={{ width: 60 + "%", height: 208, uri: selectedImages[0].uri }}
            />
          ) : null}
          <View style={styles.image_wdyt_box_display_column}>
            {selectedImages.length == 2 ? (
              <Image
                style={styles.upload_images}
                source={{ width: 50 + "%", height: 160, uri: selectedImages[1].uri }}
              />
            ) : selectedImages.length == 3 ? (
              <Image
                style={styles.upload_images}
                source={{
                  width: 33.33 + "%",
                  height: 110,
                  uri: selectedImages[1].uri,
                }}
              />
            ) : selectedImages.length == 4 ? (
              <Image
                style={styles.upload_images}
                source={{ width: 41 + "%", height: 130, uri: selectedImages[1].uri }}
              />
            ) : null}
            <View style={styles.image_wdyt_box_display_row}>
              {selectedImages.length == 3 ? (
                <Image
                  style={styles.upload_images}
                  source={{
                    width: 33.33 + "%",
                    height: 110,
                    uri: selectedImages[2].uri,
                  }}
                />
              ) : selectedImages.length == 4 ? (
                <Image
                  style={styles.upload_images}
                  source={{ width: 20 + "%", height: 75, uri: selectedImages[2].uri }}
                />
              ) : null}
              {selectedImages.length == 4 ? (
                <Image
                  style={styles.upload_images}
                  source={{ width: 20 + "%", height: 75, uri: selectedImages[3].uri }}
                />
              ) : null}
            </View>
          </View>
        </View>
      );
    } else return null;
  };
  const renderSelectedVideo = () => {
    console.log(selectedVideos)
    if (selectedVideos.length > 0) {
      console.log('áksjsk');
      return (
        <Video
          style={styles.video}
          source={{
            uri: selectedVideos[0].uri,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      );
    } else return null;
  };
  const renderImages = ({ item, index }) => {
    let isSelected = false;
    for (let i = 0; i < selectedImages.length; i++) {
      if (selectedImages[i] == index) {
        isSelected = true;
      }
    }
    return (
      <TouchableOpacity
        style={styles.image_container}
        onPress={() => {
          handleImageSelectionMultiple(item, index);
        }}
      >
        <Image style={styles._image} source={{ uri: item.uri }} />

        {isSelected ? (
          <Ionicons
            style={styles._image_ticker}
            name="checkmark-circle"
            size={18}
            color={colors.BLUE_500}
          />
        ) : null}
      </TouchableOpacity>
    );
  };
  const renderVideos = ({ item, index }) => {
    let isSelected = false;
    for (let i = 0; i < selectedVideos.length; i++) {
      if (selectedVideos[i] == index) {
        isSelected = true;
      }
    }
    return (
      <TouchableOpacity
        style={styles.image_container}
        onPress={() => {
          handleVideoSelectionMultiple(item, index);
        }}
      >
        <Image style={styles._image} source={{ uri: item.uri }} />
        {isSelected ? (
          <Ionicons
            style={styles._image_ticker}
            name="checkmark-circle"
            size={18}
            color={colors.BLUE_500}
          />
        ) : null}
        <View style={styles.duration_container}>
          <Text style={styles.duration_text}>
            {Math.floor(item.duration / 60)}:
            {item.duration - 60 * Math.floor(item.duration / 60)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const handleImageSelectionMultiple = (item, selectedItem) => {
    console.log('abajss')
    let isItemSelected = false;

    let index = 0;
    for (let i = 0; i < selectedImages.length; i++) {
      if (selectedImages[i] === selectedItem) {
        isItemSelected = true;
        index = i;
      }
    }
    if (isItemSelected) {
      selectedImages.splice(index, 1);
    } else {
      if (
        selectedImages.length < 4 &&
        selectedVideos.length == 0
      ) {
        selectedImages.push(item);
      }
    }
    setSelectedImages(selectedImages);
  };

  const handleVideoSelectionMultiple = (item, selectedItem) => {
    let isItemSelected = false;
    let index = 0;
    for (let i = 0; i < selectedVideos.length; i++) {
      if (selectedVideos[i] === selectedItem) {
        isItemSelected = true;
        index = i;
      }
    }
    if (isItemSelected) {
      selectedVideos.splice(index, 1);
    } else {
      if (
        selectedVideos.length < 1 &&
        selectedImages.length == 0
      ) {
        selectedVideos.push(item);
      }
    }
    setSelectedVideos(selectedVideos);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity style={styles.back} onPress={handleBack}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={colors.GREY_800}
          />
        </TouchableOpacity>
        <Text style={styles.textBar}>Công khai</Text>
        <TouchableOpacity
          style={styles.post}
          onPress={handlePost}>
          <Text style={styles.textPostActive}>
            ĐĂNG
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TextInput
          ref={inputRef}
          placeholder="Bạn đang nghĩ gì?"
          placeholderTextColor={color}
          style={{
            color: color,
            fontSize: 24,
            minHeight: 80,
          }}
          value={text}
          onChangeText={txt => setText(txt)}
        />
        {renderSelectedImages()}
        {renderSelectedVideo()}
        {/* <View>
            <AutoHeightImage width={windowWidth} source={{ uri: 'ph://4BE604D5-1432-493D-ADD0-AAA20E982F1F' }} />
            <TouchableOpacity
              style={styles.deleteMedia}
              onPress={() => setImages(null)}>
              <Ionicons name="close-outline" size={18} color={colors.WHITE} />
            </TouchableOpacity>
          </View> */}

        {/* <View>
            <Video
              ref={video}
              source={{
                uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
              }}
              useNativeControls
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.deleteMedia}
              onPress={() => setVideos(null)}>
              <Ionicons name="close-outline" size={18} color={colors.WHITE} />
            </TouchableOpacity>
          </View> */}
      </ScrollView>
      <View>
        <View style={styles.mediaContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => setTab('Photos')}
          >
            <Ionicons name="image-outline" size={28} color={colors.GREY_600} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => setTab('Videos')}
          >
            <Ionicons
              name="videocam-outline"
              size={28}
              color={colors.GREY_600}
            />
          </TouchableOpacity>
        </View>
      </View>
      {tab == "Photos" ? (
        <View style={styles.flatlist_container}>
          <FlatList
            style={styles.image_picker}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderImages}
          />
        </View>
      ) : tab == "Videos" ? (
        <View style={styles.flatlist_container}>
          <FlatList
            style={styles.image_picker}
            data={videos}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderVideos}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  upload_images: {
    marginLeft: 3,
    marginTop: 3,
  },
  image_wdyt_box_display_column: {
    width: 100 + "%",
    flexDirection: 'column',
  },
  image_wdyt_box_display_row: {
    width: 100 + "%",
    flexDirection: 'row',
  },
  image_wdyt_box_container: {
    flexDirection: 'row',
  },
  _image_ticker: {
    top: 3,
    right: 3,
    position: 'absolute',
    width: 20,
    height: 20,
  },
  duration_text: {
    marginLeft: 5,
    marginRight: 5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  duration_container: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#696969',
    borderRadius: 15,
  },
  _image: {
    width: '100%',
    height: '100%',
  },
  image_container: {
    width: '32%',
    height: 120,
    marginLeft: '1%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.GREY_600,
  },
  container: {
    backgroundColor: colors.WHITE,
    flex: 1,
  },
  bar: {
    alignItems: 'center',
    backgroundColor: colors.GREY_50,
    elevation: 3,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  back: {
    marginHorizontal: 15,
  },
  textBar: {
    color: colors.GREY_800,
    fontSize: 18,
  },
  post: {
    marginLeft: 'auto',
  },
  textPost: {
    color: colors.BLUE_200,
    fontWeight: 'bold',
    marginRight: 15,
  },
  textPostActive: {
    color: colors.LIGHT_BLUE_A700,
    fontWeight: 'bold',
    marginRight: 15,
  },
  deleteMedia: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    right: 4,
    top: 4,
  },
  activeFontButton: {
    borderColor: colors.LIGHT_BLUE_A700,
    borderRadius: 4,
    borderWidth: 2,
    marginHorizontal: 4,
    paddingHorizontal: 8,
  },
  fontButton: {
    borderColor: colors.BLUE_GREY_100,
    borderRadius: 4,
    borderWidth: 0.75,
    marginHorizontal: 4,
    paddingHorizontal: 8,
  },
  mediaContainer: {
    alignItems: 'center',
    borderTopColor: colors.GREY_300,
    borderTopWidth: 0.75,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingVertical: 10,
  },
  mediaButton: {
    marginHorizontal: 10,
  },
  flatlist_container: {
    width: '100%',
    height: 300,
  },
  image_picker: {
    width: '100%',
  },
});

export default PostDiaryScreen;
