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
    console.log('Attempting to start recording...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped. Creating audio blob...');
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        console.log(`Audio Blob created: Type = ${audioBlob.type}, Size = ${audioBlob.size} bytes`); // ADDED LOG
      };

      mediaRecorder.start();
      setRecording(true);
      setError(null);
      setResult(null);
      console.log('Recording started.');

      return mediaRecorder;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please ensure a microphone is connected and working.');
      } else {
        setError('Failed to start recording. Please try again.');
      }
      setRecording(false);
      return null;
    }
  };

  const stopRecording = (mediaRecorder) => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      console.log('Stopping media recorder...');
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const recognizeSong = async () => {
    if (!audioBlob) {
      setError('No audio to recognize. Please record first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // ADDED LOGS BEFORE SENDING
    console.log('Attempting to recognize song...');
    console.log(`Audio Blob for recognition: Type = ${audioBlob.type}, Size = ${audioBlob.size} bytes`);
    if (audioBlob.size === 0) {
      setError('Recorded audio is empty. Please ensure microphone is active during recording.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      // You can also inspect formData if needed (for debugging, won't show file content directly)
      // for (let pair of formData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }

      const res = await axios.post('http://localhost:5000/api/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This is handled automatically by Axios for FormData, but good to be explicit
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Recognition successful:', res.data);
      setResult(res.data);
    } catch (err) {
      console.error('Recognition failed:', err.response?.data || err.message);
      let errorMessage = 'Song recognition failed. Please try again.';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication required. Please log in.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.statusText) {
          errorMessage = `Error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error: Could not reach the server. Is your backend running?';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    console.log('Resetting audio context state...');
    setAudioBlob(null);
    setResult(null);
    setError(null);
    setRecording(false);
    setLoading(false);
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
      reset
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
