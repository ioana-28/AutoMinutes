import { FC } from 'react';
import { IAdminDashboardTemplateProps } from './IAdminDashboardTemplate';

const AdminDashboardTemplate: FC<IAdminDashboardTemplateProps> = ({ header, children }) => (
  <section className="w-full rounded-[18px] border-[3px] border-[#1e3522] bg-[#cad2c5] p-5 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.5)]">
    {header}
    <div className="mt-5">{children}</div>
  </section>
);

export default AdminDashboardTemplate;
