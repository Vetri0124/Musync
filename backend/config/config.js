module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    audioProcessing: {
      sampleRate: 44100,
      chunkSize: 4096
    }
  };