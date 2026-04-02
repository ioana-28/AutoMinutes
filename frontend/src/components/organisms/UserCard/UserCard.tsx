import { FC } from 'react';
import UserAvatar from '@molecules/UserAvatar/UserAvatar';
import Button from '@atoms/Button/Button';
import '@organisms/UserCard/UserCard.css';
import { UserCardProps } from './IUserCard';

const UserCard: FC<UserCardProps> = ({ user, onFollow }) => (
  <div className="user-card">
    <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
    <p className="user-bio">{user.bio}</p>
    <Button label="Follow" onClick={onFollow} />
  </div>
);

export default UserCard;
