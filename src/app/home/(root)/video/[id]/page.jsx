"use client";
import { SocketContext } from "@/context/socketContext";
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import WebRTCConnection from "@/lib/peer";
import { CameraOff, MicOff, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const WebRTCClient = ({ searchParams, params, pathname }) => {
  const { user, type } = searchParams;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const webRTCRef = useRef(null);
  const socket = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          type === "video"
            ? { video: true, audio: true }
            : { video: false, audio: true }
        );
        setLocalStream(stream);
        if (type === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        } else {
          localAudioRef.current.srcObject = stream;
        }

        webRTCRef.current = new WebRTCConnection(stream);
        webRTCRef.current.initializePeerConnection();

        // Listen for negotiationneeded event
      webRTCRef.current.peerConnection.onnegotiationneeded =
          handleNegotiationNeeded;

        webRTCRef.current.peerConnection.ontrack = (event) => {
          const newRemoteStream = new MediaStream();
          event.streams[0].getTracks().forEach((track) => {
            newRemoteStream.addTrack(track);
          });
          setRemoteStream(newRemoteStream);
        };

        webRTCRef.current.peerConnection.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.emit("ice:candidate", {
              id: params.id,
              candidate: event.candidate,
            });
          }
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    if (socket) {
      initLocalStream();
      if (user == "receiver") {
        socket.emit("call:request:accept", { id: params.id });
      }
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (webRTCRef.current) {
        webRTCRef.current.closeConnection();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (type === "video" && remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    } else if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (socket) {
      const handleUserCall = (data) => {
        receiveOffer(data.offer, data.id);
      };

      const handleAcceptedCall = (data) => {
        receiveAnswer(data.answer);
      };

      const handleIceCandidate = (candidate) => {
        handleIceCandidateReceived(candidate);
      };
      const handleCallDeclined = () => {
        router.forward(-1);
      };
      const createOffer = async () => {
        try {
          if (socket && webRTCRef.current) {
            const offer = await webRTCRef.current.createOffer();
            socket.emit("call:user", { id: params.id, offer });
          }
        } catch (error) {
          console.error("Error creating offer:", error);
        }
      };
      const handleCallRequestAccepted = () => {
        createOffer();
      };

      const handleCallDeclinedFromSender = () => {
        router.back();
      };

      socket.on("call:user", handleUserCall);
      socket.on("call:accepted", handleAcceptedCall);
      socket.on("ice:candidate", handleIceCandidate);
      socket.on("decline:call", handleCallDeclined);
      socket.on("call:request:accept", handleCallRequestAccepted);

      socket.on("decline:call", handleCallDeclinedFromSender);

      return () => {
        socket.off("call:user", handleUserCall);
        socket.off("call:accepted", handleAcceptedCall);
        socket.off("ice:candidate", handleIceCandidate);
        socket.off("decline:call", handleCallDeclined);
        socket.off("call:request:accept", handleCallRequestAccepted);
        socket.off("decline:call", handleCallDeclinedFromSender);
        socket.emit("call:decline", { id: params.id });
      };
    }
  }, [socket]);

  const receiveOffer = useCallback(
    async (offer, remoteId) => {
      try {
        if (webRTCRef.current) {
          await webRTCRef.current.receiveOffer(offer);
          const answer = await webRTCRef.current.createAnswer();
          socket.emit("call:accepted", { id: params.id, answer });
        }
      } catch (error) {
        console.error("Error receiving offer:", error);
      }
    },
    [socket, webRTCRef.current]
  );

  const receiveAnswer = useCallback(
    async (answer) => {
      try {
        if (webRTCRef.current) {
          await webRTCRef.current.receiveAnswer(answer);
        }
      } catch (error) {
        console.error("Error receiving answer:", error);
      }
    },
    [webRTCRef.current]
  );

  const handleIceCandidateReceived = useCallback(
    async (candidate) => {
      try {
        if (webRTCRef.current) {
          await webRTCRef.current.addIceCandidate(candidate);
         
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    },
    [webRTCRef.current]
  );

  const handleNegotiationNeeded = async () => {
    if (webRTCRef.current && socket) {
      const offer = await webRTCRef.current.negotiationNeeded();
      socket.emit("call:user", { id: params.id, offer });
    }
  };
  const handleToggleMic = async () => {
    if (webRTCRef.current) {
      if (localStream) {
        localStream.getAudioTracks()[0].enabled =
          !localStream.getAudioTracks()[0].enabled;
      }
    }
  };
  const handleToggleCamera = async () => {
    if (webRTCRef.current) {
      if (localStream) {
        localStream.getVideoTracks()[0].enabled =
          !localStream.getVideoTracks()[0].enabled;
      }
    }
  };

  const handleCallDeclined = () => {
    if (socket) {
      socket.emit("decline:call", { id: params.id });
    }
    router.back();
  };

  return type === "video" ? (
    <Video
      handleToggleMic={handleToggleMic}
      handleToggleCamera={handleToggleCamera}
      handleCallDeclined={handleCallDeclined}
      remoteVideoRef={remoteVideoRef}
      localVideoRef={localVideoRef}
    />
  ) : (
    <Audio
      handleToggleMic={handleToggleMic}
      handleCallDeclined={handleCallDeclined}
      remoteAudioRef={remoteAudioRef}
      localAudioRef={localAudioRef}
    />
  );
};

const Video = ({
  handleToggleMic,
  handleToggleCamera,
  handleCallDeclined,
  remoteVideoRef,
  localVideoRef,
}) => {
  return (
    <div className="w-full h-full bg-[#12121a] relative rounded-lg p-3 flex justify-start items-center flex-col">
      <div className=" w-full h-full rounded-lg">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain rounded-lg "
        />
      </div>

      <div className="absolute bottom-5 right-5 p-1 rounded-lg">
        <h3 className="text-white text-center">You</h3>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-40 h-40 object-cover rounded-lg"
        />
      </div>

      <div className="absolute bottom-5 ">
        <button
          className="bg-red-700 p-3 rounded-full mr-2"
          onClick={handleCallDeclined}
        >
          <Phone className="text-black" />
        </button>
        <button
          onClick={handleToggleCamera}
          className="bg-[#2d2c2c] text-white p-3 rounded-full mr-2"
        >
          <CameraOff />
        </button>
        <button
          onClick={handleToggleMic}
          className="bg-[#2d2c2c] text-white p-3 rounded-full mr-2"
        >
          <MicOff />
        </button>
      </div>
    </div>
  );
};
const Audio = ({
  handleToggleMic,
  handleCallDeclined,
  remoteAudioRef,
  localAudioRef,
  username="hello"
}) => {
  return (
    <div className="w-full h-full bg-[#12121a] relative rounded-lg p-3 flex justify-start items-center flex-col">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-32 h-32 bg-gray-700 rounded-full flex justify-center items-center">
          <h3 className="text-white text-2xl">{username}</h3>
        </div>
      </div>

      {/* Local Audio */}
      <audio
        ref={localAudioRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />

      {/* Remote Audio */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="absolute bottom-5 right-5 p-1 rounded-lg">
        <div className="w-32 h-32 bg-gray-700 rounded-full flex justify-center items-center">
          <h3 className="text-white text-2xl">You</h3>
        </div>
      </div>
      <div className="absolute bottom-5 flex items-center">
        <button
          className="bg-red-700 p-3 rounded-full mr-2"
          onClick={handleCallDeclined}
        >
          <Phone className="text-black" />
        </button>
        <button
          onClick={handleToggleMic}
          className="bg-[#2d2c2c] text-white p-3 rounded-full mr-2"
        >
          <MicOff />
        </button>
      </div>
    </div>
  );
};

export default WebRTCClient;
