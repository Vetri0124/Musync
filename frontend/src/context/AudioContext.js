import React, { createContext, useState } from 'react';
import axios from 'axios';

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);

      return mediaRecorder;
    } catch (err) {
      setError('Microphone access denied');
      console.error(err);
    }
  };

  const stopRecording = (mediaRecorder) => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const recognizeSong = async () => {
    if (!audioBlob) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const res = await axios.post('./api/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Recognition failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AudioContext.Provider value={{
      recording,
      audioBlob,
      result,
      loading,
      error,
      startRecording,
      stopRecording,
      recognizeSong,
      reset: () => {
        setAudioBlob(null);
        setResult(null);
        setError(null);
      }
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };