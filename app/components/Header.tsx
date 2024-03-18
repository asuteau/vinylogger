import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';

const Header = () => {
  return (
    <section className="layout-header p-8 flex justify-center md:justify-start items-center gap-2 shadow-md md:shadow-none md:border-b md:border-gray-300 bg-gray-100">
      <VinylRecord size={32} weight="duotone" />
      <h1>Vinylogger</h1>
    </section>
  );
};

export default Header;
