import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchContainer, SearchInput, ResultsGrid, SongCard } from './SearchPage.styles';
import { Button } from '../../components/Button/Button';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/songs?search=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) searchSongs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <SearchContainer>
      <h2>Search Songs</h2>
      <SearchInput
        type="text"
        placeholder="Search by song title, artist or album..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loading && <p>Loading...</p>}

      <ResultsGrid>
        {results.map((song) => (
          <SongCard key={song._id} to={`/song/${song._id}`}>
            <img src={song.albumCover} alt={song.title} />
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </SongCard>
        ))}
      </ResultsGrid>

      {!loading && results.length === 0 && query && (
        <p>No results found for "{query}"</p>
      )}
    </SearchContainer>
  );
};

export default SearchPage;