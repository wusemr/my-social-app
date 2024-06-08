import AsyncStorage from "@react-native-async-storage/async-storage"

// 사용자 아이디 저장
export const saveUserID = async (userID) => {
    try {
        await AsyncStorage.setItem("userid", userID)
        console.log("AsyncStorage로 저장한 user id:" ,userID)
    } catch (e) {
        console.error("AsyncStorage에 아이디를 저장하는 도중 오류가 발생하였습니다.")
    }
}

// 사용자 아이디 불러오기
export const getUserID = async () => {
    try {
        const userID = await AsyncStorage.getItem("userid")
        if(userID !== null) {
            return userID
        }
    } catch (e) {
        console.error("AsyncStorage에서 아이디를 불러오는 도중 오류가 발생하였습니다.")
        return null
    }
}