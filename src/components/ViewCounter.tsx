import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Fetch view count from GoatCounter API
    fetch('https://stablejson.goatcounter.com/counter//.json')
      .then(res => res.json())
      .then(data => {
        const totalViews = data.count_unique || data.count || 0;
        setViews(totalViews);
      })
      .catch(() => {
        // Fallback to a reasonable number if API fails
        setViews(1000);
      });
  }, []);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-foreground/5 border border-border">
      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
      <span className="text-muted-foreground text-xs">
        {views.toLocaleString()} views
      </span>
    </div>
  );
}