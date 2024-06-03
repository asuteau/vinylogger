import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
type LogoProps = {
  className: string;
  color?: 'light' | 'dark';
};

const Logo = ({className, color = 'dark'}: LogoProps) => {
  return (
    <section id="logo" className={`flex gap-4 items-center ${className}`}>
      <VinylRecord size={48} weight="duotone" className={color === 'light' ? 'fill-gray-100' : 'fill-gray-900'} />
      <h1 className={color === 'light' ? 'text-gray-100' : 'text-gray-900'}>Vinylogger</h1>
    </section>
  );
};

export default Logo;
