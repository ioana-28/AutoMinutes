import { FC } from 'react';
import { IAuthTemplateProps } from './IAuthTemplate';
import GradientBackground from '@atoms/GradientBackground/GradientBackground';

const AuthTemplate: FC<IAuthTemplateProps> = ({
  logo,
  formTitle,
  modeToggleSlot,
  formSlot,
  helperText,
}) => (
  <div className="relative min-h-screen overflow-hidden  text-[#f6f2ea]">
    <GradientBackground />

    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-stretch gap-12 px-6 py-16 md:flex-row md:items-center">
      <section className="flex flex-[1.2] items-center justify-center p-8">
        <div className="w-full max-w-md transform transition-transform hover:scale-105 duration-700">
          {logo}
        </div>
      </section>

      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#f6f2ea] p-10 text-[#152218] shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between border-b border-[#a4c3b2]/20 pb-6">
          <div>
            <p className="text-[10px] font-bold text-[#386641]/60">Access Portal</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#386641]">{formTitle}</h2>
          </div>
          {modeToggleSlot}
        </div>

        <div className="mt-2">{formSlot}</div>

        {helperText ? (
          <div className="mt-8 rounded-xl bg-[#386641]/5 p-4 text-center text-xs font-medium text-[#386641]/70">
            {helperText}
          </div>
        ) : null}
      </section>
    </div>
  </div>
);

export default AuthTemplate;
