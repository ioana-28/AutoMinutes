import { MouseEventHandler } from 'react';

export interface User {
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface UserCardProps {
  user: User;
  onFollow: MouseEventHandler<HTMLButtonElement>;
}
