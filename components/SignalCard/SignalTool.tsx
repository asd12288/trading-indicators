// "use client";

// import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
// import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
// import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
// import React, { useState } from "react";
// import { toast } from "@/hooks/use-toast";

// interface SignalToolProps {
//   signalId: string;
//   userId: string;
//   text?: "regular" | "small";
//   defaultPrefs: {
//     notifications: boolean;
//     volume: boolean;
//     favorite: boolean;
//   };
// }

// function SignalTool({
//   signalId,
//   userId,
//   defaultPrefs,
//   text = "regular",
// }: SignalToolProps) {
//   const [notifications, setNotifications] = useState(
//     defaultPrefs.notifications,
//   );

//   const [volume, setVolume] = useState(defaultPrefs.volume);
//   const [favorite, setFavorite] = useState(defaultPrefs.favorite);
//   const [isUpdating, setIsUpdating] = useState(false);

//   async function updatePreferences(
//     notificationsValue: boolean,
//     volumeValue: boolean,
//     favoriteValue: boolean,
//     originalValues: {
//       notifications: boolean;
//       volume: boolean;
//       favorite: boolean;
//     },
//   ) {
//     if (isUpdating) return;

//     setIsUpdating(true);
//     try {
//       const response = await fetch("/api/preferences", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           signalId,
//           notifications: notificationsValue,
//           volume: volumeValue,
//           favorite: favoriteValue,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update preferences");
//       }
//     } catch (err) {
//       console.error("Error updating preferences:", err);
//       setNotifications(originalValues.notifications);
//       setVolume(originalValues.volume);
//       setFavorite(originalValues.favorite);

//       toast({
//         title: "Error",
//         description: "Failed to update preferences. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsUpdating(false);
//     }
//   }

//   async function handleNotifications(signalId: string) {
//     if (isUpdating) return;
//     const originalValues = { notifications, volume, favorite };
//     const newNotificationsValue = !notifications;
//     setNotifications(newNotificationsValue);
//     toast({
//       title: `Notification  ${newNotificationsValue ? "enabled" : "disabled"}`,
//       description: `the notification for the signal ${signalId} will now be  ${newNotificationsValue ? "enabled" : "disabled"}`,
//     });

//     await updatePreferences(
//       newNotificationsValue,
//       volume,
//       favorite,
//       originalValues,
//     );
//   }

//   async function handleVolume(signalId: string) {
//     if (isUpdating) return;
//     const originalValues = { notifications, volume, favorite };
//     const newVolumeValue = !volume;
//     setVolume(newVolumeValue);
//     toast({
//       title: `Volume  ${newVolumeValue ? "enabled" : "disabled"}`,
//       description: `The alert sound for the signal ${signalId} will now be  ${newVolumeValue ? "enabled" : "disabled"}`,
//     });

//     await updatePreferences(
//       notifications,
//       newVolumeValue,
//       favorite,
//       originalValues,
//     );
//   }

//   async function handleFavorite(signalId: string) {
//     if (isUpdating) return;
//     const originalValues = { notifications, volume, favorite };
//     const newFavoriteValue = !favorite;
//     setFavorite(newFavoriteValue);
//     toast({
//       title: `newFavoriteValue ${signalId} added to favorites`,
//       description: `The signal ${signalId} will now be  ${newFavoriteValue ? "enabled" : "disabled"}`,
//     });

//     await updatePreferences(
//       notifications,
//       volume,
//       newFavoriteValue,
//       originalValues,
//     );
//   }

//   const size = text === "small" ? "text-xl" : "text-4xl";

//   return (
//     <div className="flex items-center space-x-4 border-l-2 pl-4">
//       <button
//         disabled={isUpdating}
//         onClick={() => handleNotifications(signalId)}
//       >
//         {notifications ? (
//           <IoIosNotifications className={size} />
//         ) : (
//           <IoIosNotificationsOff className={size} />
//         )}
//       </button>

//       <button disabled={isUpdating} onClick={() => handleVolume(signalId)}>
//         {volume ? (
//           <FaVolumeUp className={size} />
//         ) : (
//           <FaVolumeMute className={size} />
//         )}
//       </button>

//       <button disabled={isUpdating} onClick={() => handleFavorite(signalId)}>
//         {favorite ? (
//           <MdFavorite className={size} />
//         ) : (
//           <MdFavoriteBorder className={size} />
//         )}
//       </button>
//     </div>
//   );
// }

// export default SignalTool;
"use client";

import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import React from "react";
import { toast } from "@/hooks/use-toast";
import usePreferences from "@/hooks/usePreferences";

interface SignalToolProps {
  signalId: string;
  userId: string;
  text?: "regular" | "small";
}

function SignalTool({ signalId, userId }: SignalToolProps) {
  const { preferences, updatePreference, isLoading } = usePreferences(userId);

  // Fallback to some default if no preferences exist for this signal yet
  const currentPrefs = preferences[signalId] || {
    notifications: false,
    volume: false,
    favorite: false,
  };

  const { notifications, volume, favorite } = currentPrefs;

  async function handleNotifications() {
    const newValue = !notifications;
    toast({
      title: `Notifications ${newValue ? "enabled" : "disabled"}`,
      description: `Signal ${signalId} notifications are now ${newValue ? "enabled" : "disabled"}`,
    });
    await updatePreference(signalId, { notifications: newValue });
  }

  async function handleVolume() {
    const newValue = !volume;
    toast({
      title: `Volume ${newValue ? "enabled" : "disabled"}`,
      description: `Sound for ${signalId} is now ${newValue ? "enabled" : "disabled"}`,
    });
    await updatePreference(signalId, { volume: newValue });
  }

  async function handleFavorite() {
    const newValue = !favorite;
    toast({
      title: newValue
        ? `Signal ${signalId} added to favorites`
        : `Signal ${signalId} removed from favorites`,
      description: `Favorite = ${newValue}`,
    });
    await updatePreference(signalId, { favorite: newValue });
  }

  return (
    <div className="flex items-center space-x-4 border-l-2 pl-4">
      {!isLoading && (
        <>
          <button onClick={handleNotifications}>
            {notifications ? (
              <IoIosNotifications className="text-4xl" />
            ) : (
              <IoIosNotificationsOff className="text-4xl" />
            )}
          </button>

          <button onClick={handleVolume}>
            {volume ? (
              <FaVolumeUp className="text-4xl" />
            ) : (
              <FaVolumeMute className="text-4xl" />
            )}
          </button>

          <button onClick={handleFavorite}>
            {favorite ? (
              <MdFavorite className="text-4xl" />
            ) : (
              <MdFavoriteBorder className="text-4xl" />
            )}
          </button>
        </>
      )}
      {isLoading && <div></div>}
    </div>
  );
}

export default SignalTool;
