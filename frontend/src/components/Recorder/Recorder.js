import React, { useState, useEffect, useContext } from 'react';
import { AudioContext } from '../../context/AudioContext';
import  Button  from '../Button/Button';
import { RecorderContainer, Visualizer, ResultContainer } from './Recorder.styles';

const Recorder = () => {
  const {
    recording,
    audioBlob,
    result,
    loading,
    error,
    startRecording,
    stopRecording,
    recognizeSong,
    reset
  } = useContext(AudioContext);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  const handleStartRecording = async () => {
    const recorder = await startRecording();
    setMediaRecorder(recorder);
    
    // Simple visualization simulation
    const interval = setInterval(() => {
      setVisualizerData(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  };

  const handleStopRecording = () => {
    stopRecording(mediaRecorder);
    setVisualizerData([]);
  };

  return (
    <RecorderContainer>
      {!recording && !audioBlob && (
        <Button onClick={handleStartRecording} disabled={loading}>
          Start Recording
        </Button>
      )}

      {recording && (
        <>
          <Visualizer>
            {visualizerData.map((height, index) => (
              <div key={index} style={{ height: `${height}%` }} />
            ))}
          </Visualizer>
          <Button onClick={handleStopRecording} color="red">
            Stop Recording
          </Button>
        </>
      )}

      {audioBlob && !recording && (
        <>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <div>
            <Button onClick={recognizeSong} disabled={loading}>
              {loading ? 'Processing...' : 'Recognize Song'}
            </Button>
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
          </div>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <ResultContainer>
          <h3>Match Found!</h3>
          <img src={result.albumCover} alt={result.title} />
          <h4>{result.title}</h4>
          <p>{result.artist}</p>
          <p>Album: {result.album}</p>
          <audio controls src={result.previewUrl} />
        </ResultContainer>
      )}
    </RecorderContainer>
  );
};

export default Recorder;