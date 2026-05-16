import { FC } from 'react';
import { IAuthTemplateProps } from './IAuthTemplate';

const AuthTemplate: FC<IAuthTemplateProps> = ({
  brandLabel,
  title,
  description,
  featureCards,
  formTitle,
  modeToggleSlot,
  formSlot,
  helperText,
}) => (
  <div className="relative min-h-screen overflow-hidden bg-[#0d1b12] text-[#f6f2ea]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(140,189,152,0.45),_transparent_55%)]" />
    <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#f4b860] opacity-25 blur-3xl" />
    <div className="pointer-events-none absolute -left-16 bottom-16 h-64 w-64 rounded-full bg-[#7fd1b9] opacity-20 blur-3xl" />

    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-stretch gap-8 px-6 py-16 md:flex-row md:items-center">
      <section className="flex-1 font-['Space_Grotesk']">
        <p className="text-sm uppercase tracking-[0.35em] text-[#a6d4b4]">{brandLabel}</p>
        <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-xl text-lg text-[#d7e7dc]">{description}</p>
        <div className="mt-8 grid gap-4 text-sm text-[#cfe1d6] md:grid-cols-2">
          {featureCards}
        </div>
      </section>

      <section className="w-full max-w-md rounded-3xl border border-[#294035] bg-[#f6f2ea] p-8 text-[#152218] shadow-[0_30px_80px_rgba(7,14,10,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#4a6c5b]">Get started</p>
            <h2 className="mt-2 text-2xl font-semibold">{formTitle}</h2>
          </div>
          {modeToggleSlot}
        </div>

        {formSlot}

        {helperText ? <div className="mt-6 text-xs text-[#4a6c5b]">{helperText}</div> : null}
      </section>
    </div>
  </div>
);

export default AuthTemplate;
