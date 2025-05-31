const fft = require('fft-js');
const fs = require('fs'); // For reading and deleting temporary files
const util = require('util');
const exec = util.promisify(require('child_process').exec); // For running FFmpeg commands
const crypto = require('crypto'); // Node.js built-in crypto module

// Helper to find the next power of 2
function nextPowerOf2(n) {
    if (n === 0) return 1;
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n + 1;
}

// Your existing processAudio function with padding logic
function processAudio(audioData, sampleRate) {
    // 1. Convert to Float32Array
    const floatData = new Float32Array(audioData);

    // 2. Determine target FFT size (next power of 2)
    const fftSize = nextPowerOf2(floatData.length);

    // 3. Create a new Float32Array for windowed data and pad with zeros
    const paddedData = new Float32Array(fftSize).fill(0); // Initialize with zeros
    paddedData.set(floatData); // Copy original data into the padded array

    // 4. Apply Hann Window to the padded data
    const windowed = applyHannWindow(paddedData);

    // 5. Perform FFT
    // fft-js expects an array where elements are real numbers, it will assume imaginary parts are zero.
    const phasors = fft.fft(windowed);
    const magnitudes = fft.util.fftMag(phasors);

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

// === NEW: createFingerprint function ===
async function createFingerprint(audioFilePath) {
    console.log(`[createFingerprint] Starting to process file: ${audioFilePath}`);

    const rawAudioPath = `${audioFilePath}_raw.wav`; // Temporary file for raw audio data
    const sampleRate = 44100; // Define a consistent sample rate for processing

    try {
        // Step 1: Use FFmpeg to decode the uploaded audio file to a raw, mono WAV format
        console.log(`[createFingerprint] Running FFMPEG to decode: ${audioFilePath}`);
        await exec(`ffmpeg -i "${audioFilePath}" -f s16le -ac 1 -ar ${sampleRate} -acodec pcm_s16le "${rawAudioPath}"`);
        console.log(`[createFingerprint] FFMPEG decoding complete. Raw audio saved to: ${rawAudioPath}`);

        // Step 2: Read the raw audio data from the temporary WAV file
        const rawBuffer = fs.readFileSync(rawAudioPath);
        const audioDataInt16 = new Int16Array(rawBuffer.buffer, rawBuffer.byteOffset, rawBuffer.length / Int16Array.BYTES_PER_ELEMENT);
        const audioDataFloat32 = new Float32Array(audioDataInt16.length);
        for(let i=0; i<audioDataInt16.length; i++) {
            audioDataFloat32[i] = audioDataInt16[i] / 32768.0;
        }
        console.log(`[createFingerprint] Raw audio data read. Number of samples: ${audioDataFloat32.length}`);

        // Step 3: Process the audio data using your existing processAudio function
        const { magnitudes } = processAudio(audioDataFloat32, sampleRate);
        console.log(`[createFingerprint] Audio processed by processAudio.`);

        // Step 4: Create a simple fingerprint hash from the magnitudes
        const fingerprintData = magnitudes
            .filter((_, i) => i % 10 === 0)
            .map(m => Math.floor(m * 1000))
            .join('');

        const hash = crypto.createHash('sha256');
        hash.update(fingerprintData);
        const finalFingerprint = hash.digest('hex');

        console.log(`[createFingerprint] Final fingerprint generated: ${finalFingerprint}`);
        return finalFingerprint;

    } catch (error) {
        console.error(`[createFingerprint] Error during audio processing:`, error);
        throw new Error(`Audio fingerprinting failed: ${error.message}`);
    } finally {
        // IMPORTANT: Clean up the temporary raw audio file created by FFmpeg
        if (fs.existsSync(rawAudioPath)) {
            fs.unlinkSync(rawAudioPath);
            console.log(`[createFingerprint] Cleaned up temporary raw audio file: ${rawAudioPath}`);
        }
    }
}

// Export both functions
module.exports = {
    processAudio,
    createFingerprint
};