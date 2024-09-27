"use client";
import { useState, useEffect } from "react";
import axios from "axios";
export default function useFetchData({
  path,
  body = null,
  method = "get",
  headers = {},
  dependencies = [],
}) {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setLoader(true);

    const fetchData = async () => {
      try {
        const options = {
          withCredentials: true,
          headers: headers,
          cancelToken: source.token,
        };

        if (method.toLowerCase() === "get") {
          const res = await axios.get(path, options);
          setData(res.data?.data);
        } else {
          const res = await axios[method](path, body, options);
          setData(res.data?.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
        } else {
          console.error(err);
          setError(err);
        }
      } finally {
        setLoader(false);
      }
    };

    fetchData();

    return () => {
      source.cancel("Component unmounted");
    };
  }, dependencies);

  return { data, loader, error, setData };
}
