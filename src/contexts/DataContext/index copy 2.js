import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      if (loadedData && Array.isArray(loadedData.events)) {
        const sortedEvents = [...loadedData.events].sort((a, b) => new Date(b.date) - new Date(a.date));
        // update last and sort events
        setData({
          ...loadedData, // Keep the rest of the loaded data intact
          events: sortedEvents,
          last: sortedEvents[0], // The first item after sorting is the most recent
        });
      }
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
