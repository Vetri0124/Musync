import React from 'react';
import { HomeContainer, HeroSection, Features } from './HomePage.styles';
import  Button  from '../../components/Button/Button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <h1>Discover Music Around You</h1>
        <p>Identify songs playing around you with just a tap</p>
        <Button as={Link} to="/recognize">Start Recognizing</Button>
      </HeroSection>

      <Features>
        <div>
          <h3>Hear a song you like?</h3>
          <p>Record it and we'll tell you what it is</p>
        </div>
        <div>
          <h3>Explore music</h3>
          <p>Discover new songs and artists</p>
        </div>
        <div>
          <h3>Save your history</h3>
          <p>Keep track of all your recognized songs</p>
        </div>
      </Features>
    </HomeContainer>
  );
};

export default HomePage;