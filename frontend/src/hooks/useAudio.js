import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

const useAudio = () => {
  return useContext(AudioContext);
};

export default useAudio;