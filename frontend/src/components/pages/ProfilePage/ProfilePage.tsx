import { FC, MouseEventHandler } from 'react';
import ProfileTemplate from '@templates/ProfileTemplate/ProfileTemplate';
import { User } from '@organisms/UserCard/IUserCard';

const ProfilePage: FC = () => {
  const user: User = {
    name: 'Jane Doe',
    avatarUrl: 'https://i.pravatar.cc/100?img=5',
    bio: 'Frontend Developer from Berlin.',
  };

  const handleFollow: MouseEventHandler<HTMLButtonElement> = () => {
    alert(`You followed ${user.name}`);
  };

  return <ProfileTemplate user={user} onFollow={handleFollow} />;
};

export default ProfilePage;
