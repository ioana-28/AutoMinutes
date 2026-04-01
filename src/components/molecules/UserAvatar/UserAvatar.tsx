import { FC } from 'react';
import '@molecules/UserAvatar/UserAvatar.css';
import { UserAvatarProps } from '@molecules/UserAvatar/IUserAvatar';

const UserAvatar: FC<UserAvatarProps> = ({ name, avatarUrl }) => (
  <div className="user-avatar">
    <img src={avatarUrl} alt={name} className="avatar-img" />
    <span className="avatar-name">{name}</span>
  </div>
);

export default UserAvatar;
