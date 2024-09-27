import { useRef, useState, useEffect } from "react";
import axios from "axios";

export function useInfiniteScrolling({
  path = "",
  limit = 20,
  totalChats,
  setData,
}) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const listInnerRef = useRef();
  const totalPages = Math.ceil(totalChats / limit);
  const fetchNewData = async () => {
    try {
      setIsLoading(true);
      const newPath = `${path}&page=${page}`;
      const res = await axios.get(newPath, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = res.data?.data;
      setData((pre) => ({
        ...pre,
        data: [...pre.data, ...data],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchNewData();
    }
  }, [page]);

  const handleScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (Math.abs(scrollTop) + clientHeight >= scrollHeight && !isLoading) {
        if (page < totalPages) {
        
        setPage((prevPage) => prevPage + 1);
        }
      }
    }
  };

  useEffect(() => {
    const currentRef = listInnerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [listInnerRef, handleScroll]);

  return { isLoading, listInnerRef };
}
