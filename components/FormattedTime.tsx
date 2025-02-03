'use client';
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export const FormattedTime = ({ date }: { date: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initially (on SSR and first client render), output the raw date string.
  if (!mounted) {
    return <span>{date}</span>;
  }

  return <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>;
};