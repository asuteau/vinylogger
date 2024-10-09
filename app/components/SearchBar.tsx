import {MagnifyingGlass} from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Input} from './ui/input';

type SearchBarProps = {
  q: string;
  searching: boolean;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar = ({q, searching, placeholder, onChange}: SearchBarProps) => {
  return (
    <div className="relative md:max-w-[50%]">
      <MagnifyingGlass className="z-10 absolute top-1/2 left-3 transform -translate-y-1/2 fill-slate-500 dark:fill-slate-400" />
      <Input className="pl-10" placeholder={placeholder} defaultValue={q} id="q" name="q" onChange={onChange} />
      <span className={`${!searching && 'hidden'} absolute top-1/2 right-3 transform -translate-y-1/2`}>
        <VinylRecord className=" fill-slate-500 dark:fill-slate-400 animate-spin" />
      </span>
    </div>
  );
};

export default SearchBar;
