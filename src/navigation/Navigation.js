import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Octicons, Entypo, Feather } from "@expo/vector-icons"

import SignInScreen from "../authentication/SignInScreen"
import SignUpScreen from "../authentication/SignUpScreen"
import AddPostScreen from "../screens/AddPostScreen"
import FeedScreen from "../screens/FeedScreen"
import ProfileScreen from "../screens/ProfileScreen"
import NotificationScreen from "../screens/NotificationScreen"
import CameraScreen from "../screens/CameraScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const ICON_COLOR = "#F8E8EE"
const FOCUSED_ICON_COLOR = "#FFB6B9"
const ICON_SIZE = 27

/**
 * 로그인 후 진입하는 메인 페이지의 바텀탭 스크린 정의
 */
const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: [
                    {
                        display: "flex",
                        justifyContent: "center",
                        height: 90
                    },
                    null
                ]
            }}
        >
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                            name="home"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="AddPost"
                component={AddPostScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Octicons
                            name="diff-added"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Entypo
                            name="notification"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ route }) => ({
                    tabBarIcon: ({ color, size, focused }) => (
                        <Feather
                            name="user"
                            color={focused ? FOCUSED_ICON_COLOR : ICON_COLOR}
                            size={ICON_SIZE} />
                    ),
                    tabBarLabel: "",
                    headerShown: false
                })}
            />
        </Tab.Navigator>
    )
}

/**
 * 스크린 정의
 */
const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Navigation