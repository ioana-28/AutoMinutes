import { FC } from 'react';
import { IAuthFeatureCardProps } from './IAuthFeatureCard';

const AuthFeatureCard: FC<IAuthFeatureCardProps> = ({ title, description }) => (
  <div className="rounded-2xl border border-[#2b3f34] bg-[#132319] p-4">
    <p className="font-semibold">{title}</p>
    <p className="mt-2 text-[#b9d0c4]">{description}</p>
  </div>
);

export default AuthFeatureCard;
