import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
// (Keep your imports exactly as they are)

function useUpdateLocation() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        // ✨ FIX 1: If the user is NOT logged in, don't run the location watcher at all!
        // This stops the 400 Bad Request errors dead in their tracks.
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

        // ✨ FIX 2: We save the ID of the watcher to a variable
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                updateLocation(pos.coords.latitude, pos.coords.longitude)
            },
            (error) => console.error("GPS Watcher Error:", error),
            // Optional but recommended: Tells the browser not to spam the function too fast
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        )

        // ✨ FIX 3: THE MAGIC CLEANUP FUNCTION!
        // When the component unmounts or updates, this instantly kills the old loop
        // so you never have more than 1 watcher running at a time.
        return () => {
            navigator.geolocation.clearWatch(watchId);
        }
        
    }, [userData])
}

export default useUpdateLocation
