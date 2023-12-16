import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    //const source = axios.CancelToken.source();  //CancelToken is deprecated. I am using signal: AbortController instead

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, { signal: controller.signal });
        if (isMounted) {
          setData(response.data);
          setFetchError(null);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message);
          setData([]);
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    fetchData(dataUrl);
    //cleanUp function will cancel a request if the component is unloaded during the erquest and it will also set isMaounted to false
    const cleanUp = () => {
      console.log("clean up function");
      isMounted = false;
      //cancel the request
      controller.abort();
    };
    return cleanUp;
  }, [dataUrl]);

  return { data, fetchError, isLoading };
};

export default useAxiosFetch;
