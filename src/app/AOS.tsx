'use client'; 

import { useEffect } from 'react';
import AOS from 'aos';
import { usePathname } from 'next/navigation';

export default function AOSInit() {
  const pathname = usePathname();   
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    AOS.refresh(); 
  }, [pathname]);
  return null;
}