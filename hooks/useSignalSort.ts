// New hook to sort signals by status priority and entry time
import { useMemo } from 'react';
import { Signal } from '@/lib/types';

// Determine priority: running < fulfilled < others
const getSignalStatusPriority = (signal: Signal): number => {
  if (signal.entry_time && !signal.exit_price) {
    return 1;
  } else if (signal.entry_time && signal.exit_price != null) {
    return 2;
  }
  return 3;
};

const useSignalSort = (signals?: Signal[]): Signal[] => {
  return useMemo(() => {
    if (!signals) return [];
    return [...signals].sort((a, b) => {
      const pa = getSignalStatusPriority(a);
      const pb = getSignalStatusPriority(b);
      if (pa !== pb) return pa - pb;
      // Same status: newest entry_time first
      const ta = new Date(a.entry_time || '').getTime();
      const tb = new Date(b.entry_time || '').getTime();
      return tb - ta;
    });
  }, [signals]);
};

export default useSignalSort;
