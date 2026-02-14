
const STORAGE_KEY = 'proheadshot_usage_data';
const MAX_DAILY_USAGE = 3;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface UsageData {
  count: number;
  firstUsageTime: number;
}

const getKey = (userId?: string | null) => {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
};

export const getUsageStats = (userId?: string | null) => {
  const key = getKey(userId);
  const stored = localStorage.getItem(key);
  const now = Date.now();
  
  if (!stored) {
    return { count: 0, remaining: MAX_DAILY_USAGE, timeUntilReset: 0 };
  }

  const data: UsageData = JSON.parse(stored);
  
  // Check if 24 hours have passed since the first usage of the cycle
  if (now - data.firstUsageTime > TWENTY_FOUR_HOURS_MS) {
    // Reset if expired
    localStorage.removeItem(key);
    return { count: 0, remaining: MAX_DAILY_USAGE, timeUntilReset: 0 };
  }

  const timeUntilReset = Math.max(0, (data.firstUsageTime + TWENTY_FOUR_HOURS_MS) - now);
  
  return {
    count: data.count,
    remaining: Math.max(0, MAX_DAILY_USAGE - data.count),
    timeUntilReset
  };
};

export const checkDailyLimit = (userId?: string | null): { allowed: boolean; timeRemainingStr?: string } => {
  const stats = getUsageStats(userId);

  if (stats.count >= MAX_DAILY_USAGE) {
    const hours = Math.floor(stats.timeUntilReset / (1000 * 60 * 60));
    const minutes = Math.floor((stats.timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
    return { 
      allowed: false, 
      timeRemainingStr: `${hours}h ${minutes}m` 
    };
  }

  return { allowed: true };
};

export const incrementDailyUsage = (userId?: string | null) => {
  const key = getKey(userId);
  const stored = localStorage.getItem(key);
  const now = Date.now();
  
  let data: UsageData;

  if (stored) {
    data = JSON.parse(stored);
    // If the existing window has expired, reset it
    if (now - data.firstUsageTime > TWENTY_FOUR_HOURS_MS) {
      data = { count: 1, firstUsageTime: now };
    } else {
      data.count += 1;
    }
  } else {
    data = { count: 1, firstUsageTime: now };
  }

  localStorage.setItem(key, JSON.stringify(data));
};

export const getUsageLimit = () => MAX_DAILY_USAGE;
