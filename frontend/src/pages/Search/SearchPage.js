// backend/frontend/src/pages/SearchPage/SearchPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SearchContainer, SearchInput, ResultsGrid, SongCard } from './SearchPage.styles';

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
      // Ensure the API endpoint is correct for your backend setup
      const res = await axios.get(`http://localhost:5000/api/songs/search?search=${query}`);
      // Assuming res.data.data holds the array of songs based on your backend response structure
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
        {results && Array.isArray(results) && results.map((song) => (
          // --- Corrected SongCard to link to external Last.fm URL ---
          <SongCard
            key={song._id} // Keep key prop for React list rendering
            as="a" // Render SongCard as a standard anchor <a> tag
            href={song.url} // Use the 'url' property provided by Last.fm
            target="_blank" // Open the link in a new browser tab
            rel="noopener noreferrer" // Recommended for security with target="_blank"
          >
            <img src={song.albumCover} alt={song.title} />
            <h4>{song.title}</h4>
            <p>{song.artist}</p>
          </SongCard>
        ))}
      </ResultsGrid>

      {!loading && results && results.length === 0 && query && (
        <p>No results found for "{query}"</p>
      )}
      {!loading && !query && results && results.length === 0 && (
        <p>Start typing to search for songs.</p>
      )}
    </SearchContainer>
  );
};

export default SearchPage;