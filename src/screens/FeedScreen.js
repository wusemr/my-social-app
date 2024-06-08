import React, { useEffect, useState, useRef } from "react"
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    Animated
} from "react-native"
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { getAllPost, getProfileImage } from "../../database/database"
import Post from "../components/Post"
import UserPostsModal from "../components/UserPostsModal"

const { width } = Dimensions.get("window")

// 모든 User의 게시물이 출력되는 화면입니다.
const FeedScreen = () => {
    const navigation = useNavigation()
    const scrollViewRef = useRef(null)
    const upScaleValue = useRef(new Animated.Value(1)).current
    const downScaleValue = useRef(new Animated.Value(1)).current

    const [posts, setPosts] = useState([])
    const [refreshing, setRefreshing] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    // 페이지 새로고침
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        fetchPosts()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    const startUpPressAnimation = () => {
        Animated.timing(upScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endUpPressAnimation = () => {
        Animated.timing(upScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    const startDownPressAnimation = () => {
        Animated.timing(downScaleValue, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true
        }).start()
    }

    const endDownPressAnimation = () => {
        Animated.timing(downScaleValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start()
    }

    // 맨 위로 스크롤
    const scrollToTop = () => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }

    // 맨 아래로 스크롤
    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }

    // 게시물 불러오기
    const fetchPosts = async () => {
        try {
            const postsData = await getAllPost()
            const sortedPosts = postsData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
            setPosts(sortedPosts)
        } catch (e) {
            console.error("게시물 불러오기를 실패했습니다.", e)
        }
    }

    // 프로필 이미지 불러오기
    const fetchProfileImage = async (id) => {
        try {
            const imageUri = await getProfileImage(id)
            return imageUri
        } catch (e) {
            console.error(`${id} 님의 프로필 이미지 불러오기를 실패했습니다`)
            return false
        }
    }

    // 프로필 이미지를 눌렀을 때 로직
    const handleProfilePress = (userId) => {
        setSelectedUserId(userId)
        setModalVisible(true)   // UserPostsModal 출력
    }

    // 카메라 촬영 화면으로 전환
    const cameraButtonHandler = () => {
        navigation.navigate("Camera")
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchPosts()
        }, [])
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraButtonContainer} >
                <TouchableOpacity onPress={() => cameraButtonHandler()}>
                    <MaterialCommunityIcons name="camera-iris" size={32} color="#888888" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ref={scrollViewRef}
            >
                <View style={{ alignItems: "center" }}>
                    {
                        posts.map((post, index) => (
                            <Post
                                key={index}
                                post={post}
                                fetchProfileImage={fetchProfileImage}
                                handleProfilePress={handleProfilePress}
                                styles={postStyles}
                                like={true}
                            />
                        ))
                    }
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { marginBottom: 5, transform: [{ scale: upScaleValue }] }]}
                    onPressIn={startUpPressAnimation}
                    onPressOut={endUpPressAnimation}
                    onPress={scrollToTop}
                    activeOpacity={1}
                >
                    <FontAwesome5 name="angle-up" size={30} color="#F9F5F6" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, {transform: [{ scale: downScaleValue }]}]}
                    onPressIn={startDownPressAnimation}
                    onPressOut={endDownPressAnimation}
                    onPress={scrollToBottom}
                    activeOpacity={1}
                >
                    <FontAwesome5 name="angle-down" size={30} color="#F9F5F6" />
                </TouchableOpacity>
            </View>

            <UserPostsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                userId={selectedUserId}
            />
        </SafeAreaView>
    )
}

export default FeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    scrollView: {
        width: width,
        alignItems: "center",
        marginTop: "1%"
    },
    cameraButtonContainer: {
        margin: "3%",
        marginLeft: "5%",
        width: "10%",
    },
    buttonContainer: {
        position: "absolute",
        bottom: 10,
        right: 10
    },
    button: {
        backgroundColor: "#FCD1D180",
        height: 37,
        width: 37,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        shadowColor: "#FCD1D1",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 1.4,
        elevation: 5
    }
})

const postStyles = StyleSheet.create({
    container: {
        width: width * 0.9,
        backgroundColor: "#FFF",
        borderRadius: 13,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#F2BED1",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "2%"
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: "#F8E8EE",
        marginRight: "3%",
        alignItems: "center",
        justifyContent: "center"
    },
    username: {
        fontSize: 16,
        color: "#555555",
        fontWeight: "700"
    },
    image: {
        height: 300,
        width: 300,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 15
    },
    content: {
        color: "#555555",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
        marginHorizontal: "2%",
        marginVertical: "1%"
    },
    date: {
        fontSize: 13,
        color: "#AAAAAA"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalImage: {
        width: "85%",
        height: "100%"
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    likeButton: {
      flexDirection: 'row',
      padding: 3,
      marginTop: 2,
      marginLeft: 5
    }
})