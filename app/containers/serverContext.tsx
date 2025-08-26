import Employee from '~/JsonModels/JsonEmployee';
import { createContext, useContext } from 'react';


type ServerContextType = {
    employee?: Employee,
    defaultLocale?: string,
    locale?: string,
    language?: string,
};

const ServerContext = createContext<ServerContextType>({});

export const ServerContextProvider = ({ children, context }) => {
  return (
    <ServerContext.Provider value={{
      ...context,
    }}>
      {children}
    </ServerContext.Provider>
  );
};
export const useServerContext = () => useContext(ServerContext);


