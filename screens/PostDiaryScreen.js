import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { windowWidth } from '../constants/dimensions';
import * as colors from '../constants/colors';
import * as MediaLibrary from "expo-media-library";
import { URI } from '../constants/config';
import * as ImagePicker from 'expo-image-picker';
import { Video, AVPlaybackStatus } from 'expo-av';


function PostDiaryScreen({ navigation }) {

  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const video = useRef(null);

  const [color, setColor] = useState('#FFB300');

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [user, setUser] = useState({});
  useEffect(async () => {
    const user = await AsyncStorage.getItem('user');
    setUser(JSON.parse(user));
    const res = await MediaLibrary.requestPermissionsAsync()
    if (res.granted) {
      MediaLibrary
        .getAssetsAsync({ first: 3, mediaType: "photo" })
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
  },[]);

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
  const handleAddImageLibrary = async () => {
    if (false) {
      console.log('Bạn chỉ có thể đăng 1 tệp đa phương tiện!');
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setSelectedImages(result.uri);
      }
      console.log(selectedImages);
  
    }
  };

  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(URI + 'posts/create', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,

      },
      body: JSON.stringify({
        described: text,
      }),
    });
    const res = await response.json();
    console.log(res.data)
    navigation.goBack();
  }

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
          >
            <Ionicons name="camera-outline" size={28} color={colors.GREY_600} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={handleAddImageLibrary}>
            <Ionicons name="image-outline" size={28} color={colors.GREY_600} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
          >
            <Ionicons
              name="videocam-outline"
              size={28}
              color={colors.GREY_600}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
          >
            <Ionicons
              name="play-circle-outline"
              size={28}
              color={colors.GREY_600}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
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
});

export default PostDiaryScreen;
