import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectedUserData } from "@/store/slices/auth-slices";
import { useSocket } from "./SocketContext";
import { toast } from "sonner";

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const userData = useSelector(selectedUserData);
  const socket = useSocket();
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [callType, setCallType] = useState(null); // "audio" or "video"

  useEffect(() => {
    if (socket) {
      socket.on("incoming-call", ({ roomName, type, from }) => {
        setIncomingCall({ roomName, type, from });
      });

      socket.on("call-rejected", () => {
        setIsCalling(false);
        setRoomName(null);
        toast.error("Call rejected.");
      });

      return () => {
        socket.off("incoming-call");
        socket.off("call-rejected");
      };
    }
  }, [socket]);

  const startCall = (targetUser, isVideoCall = false) => {
    if (!socket || !targetUser) return;

    const generatedRoomName = `SyncChat_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    const type = isVideoCall ? "video" : "audio";

    setRoomName(generatedRoomName);
    setCallType(type);
    setIsCalling(true);

    socket.emit("start-call", {
      to: targetUser._id,
      roomName: generatedRoomName,
      type: type,
      from: {
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
      },
    });
  };

  const acceptCall = () => {
    if (incomingCall) {
      setRoomName(incomingCall.roomName);
      setCallType(incomingCall.type);
      setIsCalling(true);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("reject-call", { to: incomingCall.from._id });
      setIncomingCall(null);
    }
  };

  const endCall = () => {
    setIsCalling(false);
    setRoomName(null);
    setCallType(null);
  };

  return (
    <CallContext.Provider
      value={{
        isCalling,
        incomingCall,
        roomName,
        callType,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
