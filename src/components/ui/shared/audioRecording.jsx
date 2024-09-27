"use client";
import { Mic, Pause, Send, Trash } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

function AudioRecording({handleFile}) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setRecording(true);
  
        

        intervalRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioURL(audioURL);
          setAudioBlob(audioBlob);
         
       
          audioChunksRef.current = [];
        };
      })
      .catch((err) => {
        console.error("Error accessing microphone", err);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(intervalRef.current);
      setTimer(0);
    }
  };

  const resetRecording = () => {
   
      setAudioURL("");
      setAudioBlob(null);
      setTimer(0);
    
  };

  const handleSendMessage = () => {
    const e={
      target:{
        files:[audioBlob]
      }
    }
    if(audioBlob){
      handleFile(e)
      
      setAudioURL("");
      setAudioBlob(null);
      setTimer(0);
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {audioURL ? (
        
          <Trash onClick={resetRecording} className="cursor-pointer text-red-600" />
         
        
      ) : (
        <div className="flex items-center space-x-2">
          {recording ? (
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white px-2 rounded-full">{timer}s</span>
              <Pause onClick={stopRecording} className="cursor-pointer text-red-600" />
            </div>
          ) : (
            <Mic onClick={startRecording} className="cursor-pointer text-green-600" />
          )}
        </div>
      )}
      {audioURL && <div className="flex justify-center items-center gap-2"> <audio controls src={audioURL} className="ml-4" />
       <Send className="cursor-pointer"   onClick={handleSendMessage}/></div>}
    </div>
  );
}

export default AudioRecording;
