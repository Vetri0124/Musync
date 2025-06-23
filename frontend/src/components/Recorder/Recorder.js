import React, { useState, useEffect, useContext, useRef } from 'react';
import { AudioContext } from '../../context/AudioContext';
import Button from '../Button/Button';
import { RecorderContainer, Visualizer, ResultContainer } from './Recorder.styles'; // Ensure ResultContainer is imported

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
    const visualizerIntervalRef = useRef(null);

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
    }, [mediaRecorder]);

    const handleStartRecording = async () => {
        reset(); // Reset any previous state before starting new recording
        setVisualizerData([]);

        try {
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
        } catch (err) {
            console.error("Error starting recording:", err);
            // You might want to update the 'error' state from AudioContext here if not already handled
        }
    };

    const handleStopRecording = () => {
        // Stop recording via AudioContext and clear the visualizer interval
        stopRecording(mediaRecorder); // This should trigger the onstop event in AudioContext
        setVisualizerData([]);
        if (visualizerIntervalRef.current) {
            clearInterval(visualizerIntervalRef.current);
            visualizerIntervalRef.current = null;
        }
    };

    // Ensure recognizeSong is called when audioBlob is ready
    useEffect(() => {
        if (audioBlob && !loading && !result && !error) {
            // Only call recognizeSong if we have an audioBlob, not currently loading,
            // and haven't already got a result or an error from a previous attempt.
            recognizeSong(audioBlob);
        }
    }, [audioBlob, loading, result, error, recognizeSong]);


    // Extract song data if available
    const songData = result && result.data ? result.data : null;
    const noMatchFound = result && result.data === null; // Explicitly check for no match

    return (
        <RecorderContainer>
            {/* State 1: Ready to start recording */}
            {!recording && !audioBlob && !result && ( // Only show start button if no recording, no blob, no result
                <>
                    <p>Click the button to start recording and recognize the song around you!</p>
                    <Button onClick={handleStartRecording} disabled={loading}>
                        Recognize Song
                    </Button>
                </>
            )}

            {/* State 2: Currently recording */}
            {recording && (
                <>
                    <p>Recording in progress...</p>
                    <Visualizer>
                        {visualizerData.map((height, index) => (
                            <div key={index} style={{ height: `${height}%` }} />
                        ))}
                    </Visualizer>
                    <Button onClick={handleStopRecording} style={{ backgroundColor: 'red' }}>
                        Stop Recording
                    </Button>
                </>
            )}

            {/* State 3: Audio recorded, processing for recognition */}
            {audioBlob && !recording && loading && (
                <p>Processing audio for recognition...</p>
            )}

            {/* Display error messages */}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

            {/* Display recognition result or "No Match Found" */}
            {songData ? ( // If songData exists (i.e., a song was matched)
                <ResultContainer>
                    <h3>Match Found!</h3>
                    {/* Use songData.coverImage, provide fallback to default-cover.png */}
                    <img
                        src={songData.coverImage || 'default-cover.png'} // Changed this line
                        alt={songData.title || 'Album Cover'}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'default-cover.png'; }} // Changed this line
                    />
                    <h4>{songData.title}</h4>
                    <p>Artist: {songData.artist}</p>
                    <p>Album: {songData.album || 'N/A'}</p>
                    <p>Genre: {songData.genre || 'N/A'}</p>
                    <p>Year: {songData.year || 'N/A'}</p>
                    <p>Duration: {songData.duration ? `${Math.floor(songData.duration / 1000)} seconds` : 'N/A'}</p>

                    {/* Conditional rendering for streaming links based on their existence */}
                    {songData.spotifyUrl && (
                        <Button as="a" href={songData.spotifyUrl} target="_blank" rel="noopener noreferrer" style={{ margin: '0.5rem' }}>
                            Listen on Spotify
                        </Button>
                    )}
                    {songData.appleMusicUrl && (
                        <Button as="a" href={songData.appleMusicUrl} target="_blank" rel="noopener noreferrer" style={{ margin: '0.5rem' }}>
                            Listen on Apple Music
                        </Button>
                    )}
                    {songData.youtubeUrl && (
                        <Button as="a" href={songData.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ margin: '0.5rem' }}>
                            Watch on YouTube
                        </Button>
                    )}

                    {/* Show Try Again button after a result is displayed */}
                    <Button onClick={reset} style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                        Try Again
                    </Button>
                </ResultContainer>
            ) : (
                // If no songData, check if a "no match" response was received or if it's the initial state
                !loading && !recording && result && noMatchFound && (
                    <ResultContainer>
                        <h3>No Match Found!</h3>
                       
                        <Button onClick={reset} style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                            Try Again
                        </Button>
                    </ResultContainer>
                )
            )}

            {/* This condition ensures "Try Again" is shown after a recognition attempt, regardless of match */}
            {!recording && !loading && (audioBlob || result || error) && !songData && !noMatchFound && (
                 <Button onClick={reset} style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                    Try Again
                </Button>
            )}

        </RecorderContainer>
    );
};

export default Recorder;