import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { GetUserImageSrc, uploadFile } from '../../services/imageService'
import { Image } from 'expo-image'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { updateUser } from '../../services/userService'
import { router, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

const EditPostAdmin = () => {
    const { postId, body, file } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [post, setPost] = useState({
      body: '',
      file: '',
  
    });
    useEffect(() => {
      if (postId) {
        setPost({
          body: body || '',
          file: file || '',
        });
      }
    }, [])
    const onPickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
  
      if (!result.canceled) {
        setPost({ ...user, file: result.assets[0] });
      }
    }
  
    const onsubmit = async () => {
      let postData = { ...post };
      let {  body, file } = postData;
      if (!body) {
        Alert.alert("Chỉnh sửa bài viết", "Làm ơn điền đủ thông tin");
        return;
      }
      setLoading(true);
  
      if (typeof file == 'object') {
        //upload image
        let file = await uploadFile('postImages', file?.uri, true);
        if (file.success) postData.file = file.data;
        else postData = null;
      }
      const res = await updateUser(userId, userData);
      setLoading(false);
  
      if (res.success) {
      //   setUserData({ ...currentUser, ...userData });
        router.back();
      }
  }

  let imageSource = user.image && typeof user.image == 'object' ? user.image.uri : GetUserImageSrc(user.image)
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Chỉnh Sửa Trang Cá Nhân" />
          {/* form */}

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar}></Image>
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Vui lòng điền thông tin hồ sơ của bạn
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder='Nhập Name'
              value={user.name}
              onChangeText={value => setUser({ ...user, name: value })}
            />

            <Input
              icon={<Icon name="call" />}
              placeholder='Nhập Số Điện Thoại'
              value={user.phoneNumber}
              onChangeText={value => setUser({ ...user, phoneNumber: value })}
            />

            <Input
              icon={<Icon name="location" />}
              placeholder='Nhập Địa Chỉ'
              value={user.address}
              onChangeText={value => setUser({ ...user, address: value })}
            />

            <Input
              icon={<Icon name="mail" />}
              placeholder='Nhập Email'
              value={user.email}
              onChangeText={value => setUser({ ...user, email: value })}
            />

            <Input
              placeholder='Nhập Tiểu Sử'
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={value => setUser({ ...user, bio: value })}
            />

            <Button title='Cập Nhật' loading={loading} onPress={onsubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditPostAdmin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15
  },
  input: {

  }
})