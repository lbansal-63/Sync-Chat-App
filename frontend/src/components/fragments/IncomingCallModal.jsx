import React from 'react';
import { useCall } from '@/contexts/CallContext';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';
import { splitName } from './NewDm';

const IncomingCallModal = () => {
  const { incomingCall, acceptCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  const { from, type } = incomingCall;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e1f25] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full relative mb-6">
            <div className="absolute inset-0 bg-[#8417ff] rounded-full animate-ping opacity-20"></div>
            {from.image ? (
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={from.image}
                  className="object-cover w-full h-full rounded-full border-4 border-[#8417ff]/30"
                />
              </Avatar>
            ) : (
              <div
                className={`w-24 h-24 flex items-center justify-center rounded-full text-2xl font-bold border-4 border-[#8417ff]/30 ${getColor(
                  from.color || 0
                )}`}
              >
                {from.firstName ? splitName(from.firstName, from.lastName || "") : "U"}
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {from.firstName ? `${from.firstName} ${from.lastName || ""}` : "Incoming Call"}
          </h3>
          <p className="text-[#8417ff] font-medium flex items-center gap-2 mb-8">
            {type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            {type === 'video' ? 'Incoming Video Call...' : 'Incoming Audio Call...'}
          </p>

          <div className="flex gap-6 w-full">
            <button
              onClick={rejectCall}
              className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group"
            >
              <PhoneOff className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <button
              onClick={acceptCall}
              className="flex-1 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group"
            >
              {type === 'video' ? (
                <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ) : (
                <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
