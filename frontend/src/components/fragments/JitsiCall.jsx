import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useSelector } from 'react-redux';
import { selectedUserData } from '@/store/slices/auth-slices';
import { useCall } from '@/contexts/CallContext';
import { X } from 'lucide-react';

const JitsiCall = () => {
  const userData = useSelector(selectedUserData);
  const { roomName, callType, endCall } = useCall();

  if (!roomName) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="h-[6vh] flex items-center justify-between px-6 bg-[#1c1d25] border-b border-white/10">
        <span className="text-white font-medium">
          {callType === 'video' ? 'Video Call' : 'Audio Call'}
        </span>
        <button 
          onClick={endCall}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1">
        <JitsiMeeting
          domain="meet.ffmuc.net"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: callType === 'audio',
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            enableLobby: false,
            enableClosePage: false,
            disableDeepLinking: true,
            defaultLanguage: 'en',
            p2p: { enabled: true },
            requireDisplayName: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            DEFAULT_BACKGROUND: '#1c1d25',
            MOBILE_APP_PROMO: false,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.email,
          }}
          onApiReady={(externalApi) => {
            // Handle any specific API events if needed
            externalApi.addEventListener('videoConferenceLeft', () => {
              endCall();
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
      </div>
    </div>
  );
};

export default JitsiCall;
