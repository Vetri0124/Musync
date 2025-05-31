import React, { useState, useEffect, useContext, useRef } from 'react'; // Import useRef for interval cleanup
import { AudioContext } from '../../context/AudioContext';
import Button from '../Button/Button';
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
  const visualizerIntervalRef = useRef(null); // Use useRef to hold the interval ID

  // Effect to clean up mediaRecorder when component unmounts or mediaRecorder changes
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        console.log('MediaRecorder stopped during cleanup.');
      }
      // Also clear the visualizer interval on component unmount
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
    };
  }, [mediaRecorder]); // Dependency on mediaRecorder to ensure cleanup if it changes

  const handleStartRecording = async () => {
    // Reset any previous state before starting new recording
    reset();
    setVisualizerData([]);

    const recorder = await startRecording(); // This function should handle mic access and return MediaRecorder
    if (recorder) {
      setMediaRecorder(recorder);

      // Start visualization simulation and store the interval ID
      visualizerIntervalRef.current = setInterval(() => {
        // Generate random data for visualization (replace with actual audio data if available)
        setVisualizerData(Array.from({ length: 20 }, () => Math.random() * 100));
      }, 100);
    } else {
      // Handle cases where startRecording failed (e.g., mic permission denied)
      console.error("Failed to get media recorder. Check microphone permissions.");
    }
  };

  const handleStopRecording = () => {
    // Stop recording via AudioContext and clear the visualizer interval
    stopRecording(mediaRecorder);
    setVisualizerData([]);
    if (visualizerIntervalRef.current) {
      clearInterval(visualizerIntervalRef.current);
      visualizerIntervalRef.current = null; // Clear the ref
    }
  };

  return (
    <RecorderContainer>
      {/* State 1: Ready to start recording */}
      {!recording && !audioBlob && (
        <Button onClick={handleStartRecording} disabled={loading}>
          Start Recording
        </Button>
      )}

      {/* State 2: Currently recording */}
      {recording && (
        <>
          <Visualizer>
            {visualizerData.map((height, index) => (
              <div key={index} style={{ height: `${height}%` }} />
            ))}
          </Visualizer>
          <Button onClick={handleStopRecording} style={{ backgroundColor: 'red' }}> {/* Assuming your Button component takes style prop for color */}
            Stop Recording
          </Button>
        </>
      )}

      {/* State 3: Audio recorded, ready for recognition or retry */}
      {audioBlob && !recording && (
        <>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <div>
            <Button onClick={recognizeSong} disabled={loading}>
              {loading ? 'Processing...' : 'Recognize Song'}
            </Button>
            <Button onClick={reset} style={{ marginLeft: '1rem', border: '1px solid gray', backgroundColor: 'transparent', color: 'gray' }}> {/* Assuming your Button component takes style prop for variant */}
              Try Again
            </Button>
          </div>
        </>
      )}

      {/* Display error messages */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {/* Display recognition result */}
      {result && (
        <ResultContainer>
          <h3>Match Found!</h3>
          {/* Provide a fallback placeholder image if albumCover is missing */}
          <img
            src={result.albumCover || 'https://placehold.co/200x200/cccccc/333333?text=No+Cover'}
            alt={result.title || 'Album Cover'}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/cccccc/333333?text=Image+Error'; }} // Fallback on image load error
          />
          <h4>{result.title}</h4>
          <p>{result.artist}</p>
          <p>Album: {result.album}</p>
          {result.previewUrl && <audio controls src={result.previewUrl} />} {/* Only show audio if previewUrl exists */}
        </ResultContainer>
      )}
    </RecorderContainer>
  );
};

export default Recorder;
