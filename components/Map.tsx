import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { View } from 'react-native';
import { useDriverStore, useLocationStore } from '@/store';
import { calculateRegion, generateMarkersFromData } from '@/lib/map';
import { MarkerData } from '@/types/type';
import { icons } from '@/constants';

const driver = [
        {
            "id": "1",
            "first_name": "James",
            "last_name": "Wilson",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 4,
            "rating": "4.80"
        },
        {
            "id": "2",
            "first_name": "David",
            "last_name": "Brown",
            "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
            "car_seats": 5,
            "rating": "4.60"
        },
        {
            "id": "3",
            "first_name": "Michael",
            "last_name": "Johnson",
            "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
            "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
            "car_seats": 4,
            "rating": "4.70"
        },
        {
            "id": "4",
            "first_name": "Robert",
            "last_name": "Green",
            "profile_image_url": "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
            "car_image_url": "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
            "car_seats": 4,
            "rating": "4.90"
        }
    ]

const Map = () => {
    const {
        userLongitude,
        userLatitude,
        destinationLongitude,
        destinationLatitude,
    } = useLocationStore();

    const { selectedDriver, setDrivers} = useDriverStore();
    const {markers, setMarkers} = useState<MarkerData[]>([]);

    const mapRef = useRef<MapView | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleUserLocationChange = (event: any) => {
        if (isAnimating) return; // Ignore if animation is ongoing

        setIsAnimating(true);
        const { latitude, longitude } = event.nativeEvent.coordinate;

        const newRegion = calculateRegion({
            userLatitude: latitude,
            userLongitude: longitude,
            destinationLatitude,
            destinationLongitude,
        });

        // Update the region state immediately (for instant UI feedback)
        requestAnimationFrame(() => {
            mapRef.current?.animateToRegion(newRegion, 600); // Faster transition
        });

        // Reset animation flag quickly
        setTimeout(() => {
            setIsAnimating(false);
        }, 700); // Slightly more than animation duration
    };

    useEffect(() => {
        if(Array.isArray(driver)){
            if(!userLatitude || !userLongitude) return;
            const newMarkers = generateMarkersFromData({
                data: useDriverStore,
                userLatitude,
                userLongitude
            })
            setMarkers(newMarkers);
        }
    }, [driver, userLatitude, userLongitude]);  
    return (
        <View className="w-full h-full">
            <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                tintColor="black"
                mapType="standard"
                showsPointsOfInterest={false}
                showsUserLocation={true}
                showsMyLocationButton={true}
                userInterfaceStyle="light"
                style={{ flex: 1 }}
                onUserLocationChange={handleUserLocationChange}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.title}
                        image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
                        description={marker.description}
                    />
                ))}
            </MapView>
        </View>
    );
};

export default Map;
