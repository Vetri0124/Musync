import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import  Button  from '../Button/Button';
import { HeaderContainer, Logo, Nav, NavItem } from './Header.styles';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Logo to="/">MUS-YNC</Logo>
      <Nav>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/search">Search</NavItem>
        <NavItem to="/recognize">Recognize</NavItem>
        {user ? (
          <>
            <NavItem to="/profile">Profile</NavItem>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <NavItem to="/login">Login</NavItem>
            <Button to="/register" as={Link}>Register</Button>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;