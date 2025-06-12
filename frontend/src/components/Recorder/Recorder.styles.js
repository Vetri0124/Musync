import styled from 'styled-components';

export const RecorderContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: #ffffff; /* Assuming a light background for the container */
  color: #333; /* Default text color */

  h2 {
    color: #4a90e2; /* Example primary color */
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  p {
    margin-bottom: 2rem;
    color: #666; /* Example secondary text color */
    font-size: 1.1rem;
  }

  button {
    margin: 0.5rem;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    background-color: #4a90e2; /* Default button color */
    color: white;

    &:hover {
      background-color: #357ABD;
      transform: translateY(-2px);
    }

    &:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
      transform: none;
    }
  }

  audio {
    width: 100%;
    margin: 1rem 0;
  }
`;

export const Visualizer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 0 5px;
  div {
    width: 8px;
    background-color: #4a90e2;
    margin: 0 2px;
    border-radius: 2px;
    transition: height 0.1s ease-out;
  }
`;

export const ResultContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fdfdfd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h3 {
    color: #28a745; /* Success message color */
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  img {
    max-width: 250px;
    height: auto;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .no-cover-placeholder {
    width: 250px;
    height: 250px;
    background-color: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin: 0 auto 1.5rem auto;
    color: #666;
    font-style: italic;
    font-size: 1.2rem;
    border: 1px dashed #ccc;
  }

  h4 { /* For song title */
    color: #333;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  p { /* For artist, album, genre, year, duration */
    color: #555;
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }

  audio {
    margin-top: 1rem;
    width: 80%; /* Adjust audio player width */
  }

  a {
    display: inline-block;
    margin: 0.5rem;
    padding: 0.7rem 1.2rem;
    background-color: #1DB954; /* Spotify green example */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1ed760;
    }
  }
  /* Specific styles for other streaming buttons if needed */
  a[href*="apple.com"] {
    background-color: #FC3C44; /* Apple Music red */
    &:hover { background-color: #e6373e; }
  }
  a[href*="youtube.com"] {
    background-color: #FF0000; /* YouTube red */
    &:hover { background-color: #cc0000; }
  }
`;