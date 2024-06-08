import { firestore } from "./firebaseConfig"
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where, runTransaction } from "firebase/firestore"
import { getUserID } from "../src/storage/asyncstorage"

/**
 * 회원가입 함수
 * Firebase에 새로운 user 데이터를 저장하는 로직을 수행합니다.
 * @param {string} name - 이름
 * @param {string} id - 아이디
 * @param {string} password - 비밀번호
 * @param {string} phoneNumber - 전화번호
 * @returns {boolean} - 회원가입 성공 여부 반환
 */
const signup = async (name, id, password, phoneNumber) => {
    try {
        const database = collection(firestore, "users")
        const userQuery = query(database, where("id", "==", id))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
            try {
                const docRef = await addDoc(database, {
                    name: name,
                    id: id,
                    phoneNumber: phoneNumber,
                    password: password,
                    profileImage: "",
                    posts: null
                })
                console.log(name, "님의 데이터 ID: ", docRef.id)
                return true
            } catch (e) {
                console.error("Add Query문 오류 발생: ", e)
                return false
            }
        }
    } catch (e) {
        console.log("회원가입 불가: 이미 존재하는 아이디")
        return false
    }
}

/**
 * 로그인 함수
 * Firebase에 존재하는 사용자 데이터와 입력된 아이디 및 비밀번호가 일치하는지 확인하는 로직을 수행합니다.
 * @param {string} id - 아이디
 * @param {string} password - 비밀번호
 * @returns {object || boolean} - 사용자 정보 객체 || 로그인 성공 여부 반환
 */
const signin = async (id, password) => {
    try {
        const docRef = collection(firestore, "users")
        const userQuery = query(docRef, where("id", "==", id), where("password", "==", password))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
            console.log("로그인 실패: 아이디 또는 비밀번호 오류")
            return false
        } else {
            const userData = querySnapshot.docs[0].data()
            const userID = querySnapshot.docs[0].id

            const userInfo = {
                uid: userID,
                id: userData.id,
                name: userData.name,
                profileImage: userData.profileImage,
                posts: userData.posts
            }

            return userInfo
        }
    } catch (e) {
        console.error("로그인을 시도하는 도중 오류가 발생했습니다.", e)
        return false
    }
}

/**
 * 게시물 저장 함수
 * 포스팅한 게시물의 데이터를 Firebase에 저장하는 로직을 수행합니다.
 */
const savePost = async (postData) => {
    try {
        const now = new Date()
        const createAt = now.toISOString()
        const database = collection(firestore, "posts")
        const userId = await getUserID()
        const docRef = await addDoc(database, {
            text: postData.text,
            image: postData.images,
            createAt: createAt,
            userId: userId,
            likes: {}
        })
        return true
    } catch (e) {
        console.error("게시물을 저장하는 도중 오류가 발생했습니다:", e)
        return false
    }
}

const getUserInfo = async (id) => {
    try {
        const database = collection(firestore, "users")
        const userQuery = query(database, where("id", "==", id))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
            return false
        }

        const userData = querySnapshot.docs[0].data()

        return userData
    } catch (e) {
        console.error("사용자 정보를 불러오는 도중 오류가 발생했습니다.", e)
        return false
    }
}

const getProfileImage = async (id) => {
    try {
        const database = collection(firestore, "users")
        const userQuery = query(database, where("id", "==", id))
        const querySnapshot = await getDocs(userQuery)

        if (querySnapshot.empty) {
            return false
        }

        const userData = querySnapshot.docs[0].data()
        const profileImage = userData.profileImage

        return profileImage
    } catch (e) {
        console.error("프로필 이미지를 불러오는 도중 오류가 발생했습니다.", e)
        return false
    }
}

const updateProfileImage = async (id, uri) => {
    try {
        const database = collection(firestore, "users")
        const userQuery = query(database, where("id", "==", id))
        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            const userRef = doc(firestore, "users", userDoc.id)

            await updateDoc(userRef, { profileImage: uri })

            console.log(`${id}님의 프로필 이미지가 성공적으로 업데이트 되었습니다!`)
            return true
        } else {
            console.log(`해당 아이디(${id})를 가진 유저를 찾을 수 없습니다.`)
            return true
        }
    } catch (e) {
        console.error("프로필 이미지를 업데이트하는 도중 오류가 발생했습니다.", e)
        return false
    }
}

/**
 * 전체 게시물 불러오기 함수
 * Firebase에서 게시물 데이터들을 가져오는 로직을 수행합니다.
 */
const getAllPost = async () => {
    try {
        const database = collection(firestore, "posts")
        const querySnapshot = await getDocs(database)

        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        console.log("게시물이 모두 불러와졌습니다.")
        return posts
    } catch (e) {
        console.error("게시물을 불러오는 도중 오류가 발생했습니다:", e)
        return false
    }
}

/**
 * 사용자 한 명의 게시물 불러오기 함수
 * Firebase에서 사용자의 게시물 데이터들을 가져오는 로직을 수행합니다.
 */
const getUserPost = async (id) => {
    try {
        const database = collection(firestore, "posts")
        const userPostQuery = query(database, where("userId", "==", id))
        const querySnapshot = await getDocs(userPostQuery)

        if (querySnapshot.empty) {
            console.log(`${id} 님의 게시물이 존재하지 않습니다.`)
            return []
        }

        const userPosts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return userPosts
    } catch (e) {
        console.error(`${id} 님의 게시물을 불러오는 도중 오류가 발생했습니다.`, e)
        return false
    }
}

const likePost = async (postId) => {
    try {
        const userId = await getUserID()
        const postRef = doc(firestore, 'posts', postId)
        await runTransaction(firestore, async (transaction) => {
            const postDoc = await transaction.get(postRef)
            if (!postDoc.exists()) {
                throw new Error("Document does not exist!")
            }
            const postData = postDoc.data()
            if (postData.likes[userId]) {
                console.log("이미 이 게시물에 좋아요를 눌렀습니다.")
                return false
            }
            const newLikes = { ...postData.likes, [userId]: true }
            transaction.update(postRef, { likes: newLikes })
            console.log(`${userId}님이 게시물 ${postId}에 좋아요를 눌렀습니다.`)
        })
        return true
    } catch (error) {
        console.error('Error liking post: ', error)
        return false
    }
}

/**
 * 게시물에서 좋아요를 취소하는 함수
 * @param {string} postId - 게시물 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<boolean>} - 성공 여부를 나타내는 프로미스
 */
const unlikePost = async (postId, userId) => {
    try {
        const postRef = doc(firestore, "posts", postId)
        await runTransaction(firestore, async (transaction) => {
            const postDoc = await transaction.get(postRef)
            if (!postDoc.exists()) {
                throw new Error("Document does not exist!")
            }
            const postData = postDoc.data()
            if (!postData.likes || !postData.likes[userId]) {
                console.log("이미 좋아요를 취소한 게시물입니다.")
                return false
            }
            const newLikes = { ...postData.likes }
            delete newLikes[userId]
            transaction.update(postRef, { likes: newLikes })
            console.log(`게시물 ${postId}에서 좋아요를 취소했습니다.`)
        })
        return true
    } catch (error) {
        console.error("게시물에서 좋아요를 취소하는 도중 오류가 발생했습니다.", error)
        return false
    }
}

const addNotification = async (userId, content) => {
    try {
        const now = new Date()
        const createAt = now.toISOString()
        const databsae = collection(firestore, "notifications")
        const docRef = await addDoc(databsae, {
            id: userId,
            content: content,
            createdAt: createAt
        })
        console.log('새로운 알림이 추가되었습니다. 알림 ID: ', docRef.id)
        return docRef.id
    } catch (error) {
        console.error("알림을 추가하는 도중 오류가 발생했습니다.", error)
        throw error
    }
}

const getNotifications = async () => {
    try {
        const id = await getUserID()
        const database = collection(firestore, "notifications")
        const userNotificationsQuery = query(database, where("id", "==", id))
        const querySnapshot = await getDocs(userNotificationsQuery)
        const notifications = querySnapshot.docs.map(doc => ({ docid: doc.id, ...doc.data() }))
        return notifications
    } catch (error) {
        console.error("알림을 불러오는 도중 오류가 발생했습니다.", error)
        throw error
    }
}

export { signup, signin, savePost, getUserInfo, getProfileImage, updateProfileImage, getAllPost, getUserPost, likePost, unlikePost, getNotifications, addNotification }