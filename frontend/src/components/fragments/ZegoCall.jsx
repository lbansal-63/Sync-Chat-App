import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectedUserData } from '@/store/slices/auth-slices';
import { useCall } from '@/contexts/CallContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ZegoCall = () => {
  const userData = useSelector(selectedUserData);
  const { roomName, callType, endCall } = useCall();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!roomName || !userData._id || !containerRef.current) return;

    // Get your AppID and ServerSecret from ZegoCloud Console
    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("ZegoCloud AppID or ServerSecret is missing in .env");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomName,
      userData._id,
      userData.firstName ? `${userData.firstName} ${userData.lastName || ""}` : userData.email
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false, // This makes it DIRECT
      onLeaveRoom: () => {
        endCall();
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: callType === 'video',
      showMyCameraToggleButton: callType === 'video',
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
    });

    return () => {
      if (zp) {
        zp.destroy();
      }
    };
  }, [roomName, userData, callType, endCall]);

  if (!roomName) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default ZegoCall;
