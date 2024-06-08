import React, { useState, useEffect } from "react"
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator
} from "react-native"
import { getUserPost } from "../../database/database"
import Post from "./Post"
import { useFocusEffect } from "@react-navigation/native"

const { height } = Dimensions.get("window")
const { width } = Dimensions.get("screen")

const UserPostsModal = (props) => {
    const userId = props.userId
    const visible = props.visible
    const onClose = props.onClose
    const [userPosts, setUserPosts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchUserPosts(userId)
        }
    }, [userId, fetchUserPosts])

    useFocusEffect(
        React.useCallback(() => {
            fetchUserPosts(userId)
        }, [])
    )

    const fetchUserPosts = async (id) => {
        setLoading(true)
        try {
            const posts = await getUserPost(id)
            const sortedPosts = posts.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
            setUserPosts(sortedPosts)
            setLoading(false)
        } catch (e) {
            console.error("사용자 게시물 불러오기를 실패했습니다.", e)
            setLoading(false)
        }
    }

    const renderItem = ({ item }) => (
        <Post
            post={item}
            styles={postStyles}
            disableTouchableOpacity={true}
            like={false}
        />
    )

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.headerText}>{userId} 님의 게시물</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.headerCloseText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        loading ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList
                                data={userPosts}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.flatListContent}
                            />
                        )
                    }

                </View>
            </View>
        </Modal>
    )
}

export default UserPostsModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalHeader: {
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
        width: "100%"
    },
    modalContainer: {
        width: "90%",
        maxHeight: height * 0.8,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center"
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#F2BED1",
    },
    headerCloseText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#999999",
    },
    flatListContent: {
        alignItems: "center"
    }
})

const postStyles = StyleSheet.create({
    container: {
        width: width * 0.8,
        paddingBottom: 14,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: "#BBBBBB"
    },
    header: {
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "2%"
    },
    profileImage: {
        height: 0,
        width: 0
    },
    username: {
        padding: 5,
        fontSize: 16,
        color: "#555555",
        fontWeight: "700"
    },
    image: {
        height: 200,
        width: 200,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5
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
        color: "#AAAAAA",
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
    }
})