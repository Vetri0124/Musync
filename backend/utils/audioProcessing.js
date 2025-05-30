const fft = require('fft-js'); // Changed from 'fft.js' to 'fft-js'

function processAudio(audioData, sampleRate) {
    // Convert audio data to Float32Array if needed
    const floatData = new Float32Array(audioData);
    
    // Apply window function (Hann window)
    const windowed = applyHannWindow(floatData);
    
    // Perform FFT
    const phasors = fft.fft(windowed);
    const magnitudes = fft.util.fftMag(phasors);
    
    // Convert to frequency domain
    const frequencies = magnitudes.map((mag, i) => {
        return i * sampleRate / windowed.length;
    });
    
    return { magnitudes, frequencies };
}

function applyHannWindow(data) {
    const windowed = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
        windowed[i] = data[i] * 0.5 * (1 - Math.cos(2 * Math.PI * i / (data.length - 1)));
    }
    return windowed;
}

module.exports = {
    processAudio
};