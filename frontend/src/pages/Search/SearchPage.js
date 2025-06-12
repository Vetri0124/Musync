import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  SearchContainer,
  SearchInput,
  ResultsGrid,
  SongCard
} from './SearchPage.styles';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchSongs = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/songs/search?search=${query}`);
      console.log("Search Results:", res.data.data);
      setResults(res.data.data);
    } catch (err) {
      console.error("Error searching songs:", err.response?.data?.error || err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        searchSongs();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, searchSongs]);

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
          <SongCard
            key={song._id}
            as="a"
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={ '/default-cover.png'}
              alt={song.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-cover.png';
              }}
            />
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </SongCard>
        ))}
      </ResultsGrid>

      {!loading && results.length === 0 && query && (
        <p>No results found for "{query}"</p>
      )}
      {!loading && !query && results.length === 0 && (
        <p>Start typing to search for songs.</p>
      )}
    </SearchContainer>
  );
};

export default SearchPage;
