import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'

function useUpdateLocation() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        // Stop immediately if the user is not logged in
        if (!userData) return;

        const updateLocation = async (lat, lon) => {
            try {
                const result = await axios.post(
                    `${serverUrl}/api/user/update-location`, 
                    { lat, lon }, 
                    { withCredentials: true }
                );
                console.log("Location successfully saved to DB:", result.data);
            } catch (error) {
                console.error("Location update failed:", error);
            }
        }

        // ✨ THE FIX: Check the user's role!
        if (userData.role === 'deliveryBoy') {
            // ONLY Delivery Boys get the aggressive live-tracking
            const watchId = navigator.geolocation.watchPosition(
                (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
                (error) => console.error("GPS Watcher Error:", error),
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            )
            return () => navigator.geolocation.clearWatch(watchId);
            
        } else {
            // For Shop Owners and normal Users, just grab the location ONCE.
            // This instantly stops the spam and prevents your app from freezing!
            navigator.geolocation.getCurrentPosition(
                (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
                (error) => console.error("GPS Error:", error)
            )
        }
        
    }, [userData])
}

export default useUpdateLocation
