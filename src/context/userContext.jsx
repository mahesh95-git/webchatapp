"use client";  
import { createContext, useState, useEffect } from 'react';
import useFetchData from '@/customsHook/FetchData';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { data, loader ,setData} = useFetchData({ path: '/api/user' });
  return (
    <UserContext.Provider value={{ user: data, loader,setData }}>
     {children}
    </UserContext.Provider>
  );
};
