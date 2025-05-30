import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SongDetailContainer } from './SongDetailPage.styles';
import  Button  from '../../components/Button/Button';

const SongDetailPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(`/api/songs/${id}`);
        setSong(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch song');
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!song) return <div>Song not found</div>;

  return (
    <SongDetailContainer>
      <div>
        <img src={song.albumCover} alt={song.title} />
      </div>
      <div>
        <h2>{song.title}</h2>
        <h3>{song.artist}</h3>
        <p>Album: {song.album}</p>
        <p>Release Year: {song.releaseYear}</p>
        <p>Genre: {song.genre}</p>
        <audio controls src={song.previewUrl} style={{ margin: '1rem 0' }} />
        <Button as="a" href={song.externalUrl} target="_blank" rel="noopener noreferrer">
          Listen on Streaming Service
        </Button>
      </div>
    </SongDetailContainer>
  );
};

export default SongDetailPage;