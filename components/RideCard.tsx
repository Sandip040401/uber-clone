import { Ride } from "@/types/type";
import { Text, View } from "react-native";

const RideCard = ({ ride: {
    destination_longitude,
    destination_latitude,
    origin_address,
    destination_address,
    created_at,
    ride_time,
    driver,
    payment_status,
} }:{ ride:Ride }) => {
    return(
        <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
            <Text className="text-3xl">{driver.first_name}</Text>
        </View>
    )
}

export default RideCard;