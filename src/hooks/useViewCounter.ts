import { useState, useEffect, useRef } from 'react';

const VIEW_COUNT_KEY = 'stablejson_view_count';
const SESSION_FLAG = 'stablejson_session_counted';

export function useViewCounter() {
  const [viewCount, setViewCount] = useState<number>(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // 1. Get the current total from localStorage
    const storedCount = localStorage.getItem(VIEW_COUNT_KEY);
    let currentTotal = storedCount ? parseInt(storedCount, 10) : 0;

    // 2. Check if we have already counted this specific session
    const hasBeenCountedInSession = sessionStorage.getItem(SESSION_FLAG);

    if (!hasBeenCountedInSession) {
      // First time this tab has loaded—increment the permanent total
      currentTotal += 1;
      localStorage.setItem(VIEW_COUNT_KEY, currentTotal.toString());
      // Mark this session as "counted" so refreshes don't trigger it again
      sessionStorage.setItem(SESSION_FLAG, 'true');
    }

    setViewCount(currentTotal);
  }, []);

  return viewCount;
}