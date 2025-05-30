import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ProfileContainer, ProfileInfo } from './ProfilePage.styles';
import  Button  from '../../components/Button/Button';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <h2>Your Profile</h2>
      <ProfileInfo>
        <div>
          <h3>Name</h3>
          <p>{user.name}</p>
        </div>
        <div>
          <h3>Email</h3>
          <p>{user.email}</p>
        </div>
        <div>
          <h3>Member Since</h3>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </ProfileInfo>
      <Button onClick={logout}>Logout</Button>
    </ProfileContainer>
  );
};

export default ProfilePage;