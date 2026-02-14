
const STORAGE_KEY = 'proheadshot_usage_data';
const LINKEDIN_REWARD_KEY = 'proheadshot_linkedin_reward';
const MAX_DAILY_USAGE = 3;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface UsageData {
  count: number;
  firstUsageTime: number;
}

interface LinkedInRewardData {
  lastClaimTime: number;
}

const getKey = (userId?: string | null) => {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
};

const getLinkedInKey = (userId?: string | null) => {
  return userId ? `${LINKEDIN_REWARD_KEY}_${userId}` : LINKEDIN_REWARD_KEY;
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
    if (stats.remaining > 0) {
        return { allowed: true };
    }

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

export const addCredits = (amount: number, userId?: string | null) => {
  const key = getKey(userId);
  const stored = localStorage.getItem(key);
  const now = Date.now();
  
  let data: UsageData;

  if (stored) {
    data = JSON.parse(stored);
    data.count = data.count - amount;
  } else {
    data = { count: -amount, firstUsageTime: now };
  }
  
  localStorage.setItem(key, JSON.stringify(data));
};

export const addBonusCredit = (userId?: string | null) => {
  addCredits(1, userId);
};

export const getUsageLimit = () => MAX_DAILY_USAGE;

// LinkedIn Specific Logic
export const checkLinkedInEligibility = (userId?: string | null): { allowed: boolean; timeRemainingStr?: string } => {
  const key = getLinkedInKey(userId);
  const stored = localStorage.getItem(key);
  
  if (!stored) return { allowed: true };

  const data: LinkedInRewardData = JSON.parse(stored);
  const now = Date.now();
  const timeSinceClaim = now - data.lastClaimTime;

  if (timeSinceClaim < TWENTY_FOUR_HOURS_MS) {
    const timeRemaining = TWENTY_FOUR_HOURS_MS - timeSinceClaim;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    return {
      allowed: false,
      timeRemainingStr: `${hours}h ${minutes}m`
    };
  }

  return { allowed: true };
};

export const recordLinkedInClaim = (userId?: string | null) => {
  const key = getLinkedInKey(userId);
  const data: LinkedInRewardData = { lastClaimTime: Date.now() };
  localStorage.setItem(key, JSON.stringify(data));
};
