const fft = require('fft-js');
const fs = require('fs'); // For reading and deleting temporary files
const util = require('util');
const exec = util.promisify(require('child_process').exec); // For running FFmpeg commands

// Your existing processAudio function
function processAudio(audioData, sampleRate) {
    const floatData = new Float32Array(audioData);
    const windowed = applyHannWindow(floatData);
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
        // This makes the audio data consistent for your processAudio function.
        // -i "${audioFilePath}": Input file
        // -f s16le: Force signed 16-bit little-endian format (raw PCM)
        // -ac 1: 1 audio channel (mono)
        // -ar 44100: Set audio sample rate to 44.1 kHz
        // -acodec pcm_s16le: Use PCM 16-bit little-endian codec
        // "${rawAudioPath}": Output file path
        console.log(`[createFingerprint] Running FFMPEG to decode: ${audioFilePath}`);
        await exec(`ffmpeg -i "${audioFilePath}" -f s16le -ac 1 -ar ${sampleRate} -acodec pcm_s16le "${rawAudioPath}"`);
        console.log(`[createFingerprint] FFMPEG decoding complete. Raw audio saved to: ${rawAudioPath}`);

        // Step 2: Read the raw audio data from the temporary WAV file
        const rawBuffer = fs.readFileSync(rawAudioPath);
        // The rawBuffer contains 16-bit signed integers. Convert to Float32Array for processAudio.
        const audioDataInt16 = new Int16Array(rawBuffer.buffer, rawBuffer.byteOffset, rawBuffer.length / Int16Array.BYTES_PER_ELEMENT);
        const audioDataFloat32 = new Float32Array(audioDataInt16.length);
        for(let i=0; i<audioDataInt16.length; i++) {
            // Normalize 16-bit integer values to -1.0 to 1.0 range
            audioDataFloat32[i] = audioDataInt16[i] / 32768.0;
        }
        console.log(`[createFingerprint] Raw audio data read. Number of samples: ${audioDataFloat32.length}`);

        // Step 3: Process the audio data using your existing processAudio function
        const { magnitudes } = processAudio(audioDataFloat32, sampleRate);
        console.log(`[createFingerprint] Audio processed by processAudio.`);

        // Step 4: Create a simple fingerprint hash from the magnitudes
        // This is a basic example; real fingerprinting algorithms are more complex.
        // For demonstration, we'll take a subset of magnitudes and hash them.
        const crypto = require('crypto'); // Node.js built-in crypto module
        const fingerprintData = magnitudes
            .filter((_, i) => i % 10 === 0) // Take every 10th magnitude for a smaller, representative set
            .map(m => Math.floor(m * 1000)) // Convert to integer, scale up for distinctness
            .join(''); // Join into a string

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
