import React, { useEffect, useState, useRef, useCallback } from "react"
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { getNotifications } from "../../database/database"

// 알림 화면입니다.
const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    // 페이지 새로고침
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        fetchNotifications()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    useEffect(() => {
        fetchNotifications()
    }, [])

    // 알림 패치
    const fetchNotifications = async () => {
        try {
            const fetchedNotifications = await getNotifications()
            fetchedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setNotifications(fetchedNotifications)
        } catch (error) {
            console.error("알림을 불러오는 중에 오류가 발생했습니다.", error)
        }
    }

    /**
     * 날짜 형식 포맷 함수
     * @param {string} createAt - 0000-00-00000:00:00.00000
     * @returns {string} - 현재 날짜와 생성 날짜의 시간 차이에 따라 "0주 전", "0일 전", "0시간 전", "0분 전"을 반환
    */
    const formatTimeSinceCreation = (createdAt) => {
        const currentDate = new Date()
        const creationDate = new Date(createdAt)
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

    // 알림 렌더
    const renderNotificationItem = ({ item }) => {
        const formattedTimeSinceCreation = formatTimeSinceCreation(item.createdAt)
        return (
            <View style={styles.notificationItem}>
                <Ionicons name="heart" size={20} color="#F38181" />
                <Text style={styles.notiText}>{item.content}</Text>
                <Text style={styles.timeText}>{formattedTimeSinceCreation}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>알림</Text>
            </View>

            <View style={styles.notificationContainer}>
                {
                    notifications ? (
                        <FlatList
                            data={notifications}
                            renderItem={renderNotificationItem}
                            keyExtractor={(item) => item.docid}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            contentContainerStyle={{ alignItems: 'center' }}
                        />
                    ) : (
                        <View style={styles.noNotification}>
                            <Text style={styles.noNotiText}>알림이 없습니다.</Text>
                        </View>
                    )
                }
            </View>
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        width: "100%",
        height: "10%",
        alignItems: "center",
        justifyContent: "center"
    },
    headerText: {
        color: "#F38181",
        fontSize: 24,
        fontWeight: "bold"
    },
    notificationContainer: {
        width: "100%",
        height: "90%",
        alignItems: "center",
        justifyContent: "center"
    },
    notificationItem: {
        width: "95%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#F9F5F6",
        borderRadius: 100,
        padding: "3%",
        marginVertical: "1.5%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5
    },
    notiText: {
        color: "#444444",
        fontSize: 16,
        fontWeight: "500"
    },
    timeText: {
        color: "#888888",
        fontSize: 16,
        fontWeight: "400",
        marginRight: 5
    },
    noNotification: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    noNotiText: {
        fontSize: 20,
        color: "#444444",
        fontWeight: "bold"
    }
})