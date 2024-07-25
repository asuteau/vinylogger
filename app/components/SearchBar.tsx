import {MagnifyingGlass} from '@phosphor-icons/react/dist/icons/MagnifyingGlass';
import {Input} from './ui/input';
import {HourglassHigh} from '@phosphor-icons/react/dist/icons/HourglassHigh';

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
      <HourglassHigh
        weight="fill"
        className={`${!searching && 'hidden'} absolute top-1/2 right-3 transform -translate-y-1/2 fill-slate-500 dark:fill-slate-400`}
      />
    </div>
  );
};

export default SearchBar;
