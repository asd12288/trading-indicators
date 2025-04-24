"use client";

import { useEffect } from 'react';
import SoundService from '@/lib/services/soundService';

export default function LazyLoadedComponents() {
  useEffect(() => {
    const unlock = () => {
      SoundService.initializeAudio();
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <>
      <div id="maintenance-banner-container" data-load-delay="true" />
      <div id="alerts-container" data-load-delay="true" />
      <div id="toaster-container" data-load-delay="true" />
    </>
  );
}