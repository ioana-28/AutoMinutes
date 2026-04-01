
import { FC } from 'react';
import UserCard from '@organisms/UserCard/UserCard';
import '@templates/ProfileTemplate/ProfileTemplate.css';
import { IProfileTemplateProps } from './IProfileTamplate';

const ProfileTemplate: FC<IProfileTemplateProps> = ({ user, onFollow }) => (
  <div className="profile-template">
    <UserCard user={user} onFollow={onFollow} />
  </div>
);

export default ProfileTemplate;
