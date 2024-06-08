import { useEffect, useState } from "react"
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableWithoutFeedback
} from "react-native"
import { FontAwesome6, Ionicons } from "@expo/vector-icons"
import { likePost, unlikePost, addNotification } from "../../database/database"
import { getUserID } from "../storage/asyncstorage"
/**
 * 게시물의 형식을 지정하는 컴포넌트입니다.
 * 출력되는 게시물의 정보는 아이디, 프로필 사진, 게시 날짜, 본문, 이미지입니다.
 */
const Post = (props) => {
    const userId = props.post.userId
    const text = props.post.text
    const image = props.post.image
    const createAt = props.post.createAt

    const [profileImage, setProfileImage] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [likes, setLikes] = useState(props.post.likes || 0)
    const [liked, setLiked] = useState(false)
    const [id, setId] = useState(null)

    const handleLike = async () => {
        try {
            const result = await likePost(props.post.id)
            if (result) {
                setLikes({ ...likes, [id]: true })
                setLiked(true)

                if (props.post.id != id) {
                    await addNotification(props.post.userId, `${id}님이 회원님의 게시물에 좋아요를 눌렀습니다.`)
                }
            }
        } catch (error) {
            console.error('좋아요를 누르는 도중 오류가 발생했습니다', error)
        }
    }

    const handleUnlike = async () => {
        try {
            const result = await unlikePost(props.post.id, id)
            if (result) {
                const newLikes = { ...likes }
                delete newLikes[id]
                setLikes(newLikes)
                setLiked(false)
            }
        } catch (error) {
            console.error('Error unliking post: ', error)
        }
    }

    const isLiked = () => {
        return likes.hasOwnProperty(id)
    }

    const handleLikeButton = () => {
        if (isLiked()) {
            handleUnlike()
        } else {
            handleLike()
        }
    }

    // 사진 터치 시 modal로 사진 출력
    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri)
        setModalVisible(true)
    }

    // 사진 렌더
    const renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => handleImagePress(item)} activeOpacity={1}>
            <Image
                source={{ uri: item }}
                style={props.styles.image}
            />
        </TouchableWithoutFeedback>
    )

    /**
     * 날짜 형식 포맷 함수
     * @param {string} createAt - 0000-00-00000:00:00.00000
     * @returns {string} formattedCreatedAt - 0000년 0월 00일 00시 0분
     */
    const dateFormat = (createAt) => {
        const currentDate = new Date()
        const creationDate = new Date(createAt)
        const timeDifference = currentDate - creationDate
        const seconds = Math.floor(timeDifference / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const weeks = Math.floor(days / 7)
    
        if (weeks >= 1) {
            return `${weeks}주 전`
        } else if (days >= 1) {
            return `${days}일 전`
        } else if (hours >= 1) {
            return `${hours}시간 전`
        } else {
            return `${minutes}분 전`
        }
    }

    const date = dateFormat(createAt)

    const fetchImage = async () => {
        if (props.fetchProfileImage) {
            const imageUri = await props.fetchProfileImage(userId)
            if (imageUri) {
                setProfileImage(imageUri)
            }
        }
    }

    useEffect(() => {
        fetchImage()
    }, [fetchImage])

    useEffect(() => {
        const fetchUserID = async () => {
            const id = await getUserID()
            setId(id)
            setLikes(props.post.likes || {})
        }
        fetchUserID()
    }, [])

    useEffect(() => {
        setLikes(props.post.likes || {})
    }, [props.post.likes])

    return (
        <View style={props.styles.container}>
            <View style={props.styles.header}>
                {
                    !props.disableTouchableOpacity ? (
                        <TouchableOpacity style={props.styles.profileImage} onPress={() => props.handleProfilePress(userId)}>
                            {
                                profileImage === "" ? (
                                    <FontAwesome6 name="user-large" size={16} color="#FDCEDF" />
                                ) : (
                                    <Image source={{ uri: profileImage }} style={props.styles.profileImage} />
                                )
                            }
                        </TouchableOpacity>
                    ) : (
                        <View style={props.styles.profileImage}>
                            {
                                profileImage === "" ? (
                                    <FontAwesome6 name="user-large" size={16} color="#FDCEDF" />
                                ) : (
                                    <Image source={{ uri: profileImage }} style={props.styles.profileImage} />
                                )
                            }
                        </View>
                    )
                }

                <Text style={props.styles.username}>{userId}</Text>

                <View style={{ position: "absolute", right: 5, top: 5 }}>
                    <Text style={props.styles.date}>{date}</Text>
                </View>

            </View>

            <Text style={props.styles.content}>{text}</Text>

            <FlatList
                data={image}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
            />

            {
                props.like ? (
                    <View style={props.styles.footer}>
                        <TouchableOpacity onPress={handleLikeButton} style={props.styles.likeButton}>
                            <Ionicons name={isLiked() ? "heart" : "heart-outline"} size={24} color={isLiked() ? "#F38181" : "#e5e5e5"} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 2, color: "#AAAAAA", marginTop: 3 }}>{Object.keys(likes).length}</Text>
                    </View>
                ) : (
                    <></>
                )
            }

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <TouchableOpacity
                    style={props.styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <Image source={{ uri: selectedImage }} style={props.styles.modalImage} resizeMode="contain" />
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default Post