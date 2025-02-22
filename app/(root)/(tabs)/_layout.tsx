import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

const TabIcon = ({ focused, source }: { source: ImageSourcePropType; focused: boolean }) => (
    <View className="items-center justify-center">
        <View className={`rounded-full w-14 h-14 items-center justify-center ${focused ? "bg-general-400" : ""}`}>
            <Image source={source} tintColor="white" resizeMode="contain" className="w-7 h-7" />
        </View>
    </View>
);

const Layout = () => {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    overflow: "hidden",
                    marginHorizontal: 20,
                    paddingBottom: 20,
                    marginBottom: 20,
                    height: 78,
                    position: "absolute",
                    flexDirection: "row",
                    alignItems: "center", // Ensures icons are vertically centered
                    justifyContent: "space-around", // Ensures even spacing horizontally
                    paddingVertical: 10, // Centers icons vertically inside the tab bar
                },
                tabBarItemStyle: {
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
                }}
            />
            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
                }}
            />
        </Tabs>
    );
};

export default Layout;
