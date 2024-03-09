import {VinylRecord} from '@phosphor-icons/react';

const Header = () => {
  return (
    <section className="layout-header p-8 flex justify-center md:justify-start items-center shadow-md md:shadow-none md:border-b md:border-gray-300">
      <VinylRecord size={32} weight="bold" />
      <h1>Vinylogger</h1>
    </section>
  );
};

export default Header;
