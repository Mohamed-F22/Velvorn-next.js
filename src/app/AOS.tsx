'use client'; 

import { useEffect } from 'react';
import AOS from 'aos';
import { usePathname } from 'next/navigation';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return null;
}