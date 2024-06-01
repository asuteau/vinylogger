import {createContext, useContext, useState} from 'react';

type UserContextProviderProps = {
  children: React.ReactNode;
};

type UserContext = {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContext | null>(null);

export const UserContextProvider = ({children}: UserContextProviderProps) => {
  const [user, setUser] = useState('John Doe');

  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within UserContextProvider!');
  return context;
};
