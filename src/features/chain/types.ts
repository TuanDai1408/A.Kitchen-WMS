export interface ChainSiteRanking {
  rank: number;
  code: string;
  name: string;
  region: string;
  netRevenue: number;
  targetRevenue: number;
  achievementPct: string | number;
  foodCostPct: string | number;
  laborCostPct: string | number;
  operatingProfit: number;
  profitMargin: string | number;
  status: string;
}

export interface ChainSummaryData {
  totalChainRevenue: number;
  totalChainProfit: number;
  avgChainMargin: string | number;
  avgFoodCostPct: number;
  avgLaborCostPct: number;
  rankings: ChainSiteRanking[];
}

export interface SitePLData {
  site: string;
  siteCode?: string;
  month?: string;
  grossRevenue: number;
  discount: number;
  netRevenue: number;
  targetRevenue: number;
  foodCost: number;
  foodCostPct?: string | number;
  laborCost: number;
  laborCostPct?: string | number;
  primeCost: number;
  rentCost: number;
  utilityCost: number;
  supplyCost: number;
  wasteCost: number;
  marketingCost: number;
  totalCost: number;
  operatingProfit: number;
  profitMargin: number;
  breakEvenRevenue: number;
  channels?: {
    dineIn: number;
    takeaway: number;
    catering: number;
  };
  weeklyTrends?: Array<{
    week: string;
    netRevenue?: number;
    netRev?: number;
    foodCostPct: number;
    laborCostPct: number;
    profitMargin?: number;
    profitPct?: number;
  }>;
  opMetrics?: {
    avgDailyBills: number;
    avgSpendPerBill: number;
    revenuePerSeatPerDay: number;
    peakOccupancyPct: number;
  };
  topDishes?: Array<{
    name: string;
    qty: number;
    revenue?: number;
    rev?: number;
  }>;
  actionPlans?: Array<string | { task: string }>;
}

export interface SitePosHourlyItem {
  hour: string;
  bills: number;
  revenue?: number;
  sales?: number;
  pct: number;
}

export interface SitePosData {
  date?: string;
  site?: string;
  dailyRevenue?: number;
  totalSalesToday?: number;
  totalBills?: number;
  billsToday?: number;
  avgSpendPerBill?: number;
  avgBillToday?: number;
  hourlyDistribution?: SitePosHourlyItem[];
}

export interface SiteMasterItem {
  code: string;
  name: string;
  region: string;
  address?: string;
  site_type?: string;
  phone?: string;
  budget?: number;
  status?: string;
}
