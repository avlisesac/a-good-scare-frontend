import { createContext, useContext, useEffect, useState } from "react";
import { ConfigurationResponse } from "@lorenzopant/tmdb/dist/types/configuration";
import { TMDB } from "@lorenzopant/tmdb";

type TMDBConfigContextType = {
  tmdbConfig: ConfigurationResponse | null;
  setTmdbConfig: React.Dispatch<
    React.SetStateAction<ConfigurationResponse | null>
  >;
  loading: boolean;
};

const tmdb = new TMDB(process.env.REACT_APP_TMDB_ACCESS_TOKEN ?? "");

const TMDBConfigContext = createContext<TMDBConfigContextType | undefined>(
  undefined
);

export const TMDBConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tmdbConfig, setTmdbConfig] = useState<ConfigurationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await tmdb.config.get();
        console.log("fetchConfig response:", response);
        setTmdbConfig(response);
      } catch (err) {
        console.error("fetchConfig error:", err);
        setTmdbConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <TMDBConfigContext.Provider value={{ tmdbConfig, setTmdbConfig, loading }}>
      {children}
    </TMDBConfigContext.Provider>
  );
};

export const useTMDBConfig = () => {
  const ctx = useContext(TMDBConfigContext);
  if (!ctx) {
    throw new Error("useTMDBConfig must be used within TMDBConfig provider");
  }
  return ctx;
};
