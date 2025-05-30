import React from 'react';
import { RecognizeContainer } from './RecognizePage.styles';
import Recorder from '../../components/Recorder/Recorder';

const RecognizePage = () => {
  return (
    <RecognizeContainer>
      <h2>Recognize a Song</h2>
      <p>Play the song or sing/hum it, and we'll identify it for you</p>
      <Recorder />
    </RecognizeContainer>
  );
};

export default RecognizePage;