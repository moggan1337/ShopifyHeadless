import { create } from 'zustand';
import type { Vendor, Payout, Dispute, CommissionTier } from '@/types/shopify';

interface VendorState {
  vendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
  
  // Analytics
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayout: number;
  
  // Actions
  fetchVendor: (vendorId: string) => Promise<void>;
  updateVendor: (data: Partial<Vendor>) => Promise<void>;
  getPayouts: () => Promise<Payout[]>;
  getDisputes: () => Promise<Dispute[]>;
  
  // Computed
  getCommissionRate: (amount: number) => number;
  calculateEarnings: (salesAmount: number) => { gross: number; commission: number; net: number };
}

const DEFAULT_COMMISSION_TIERS: CommissionTier[] = [
  { id: '1', name: 'Tier 1', minAmount: 0, maxAmount: 1000, commissionRate: 0.15 },
  { id: '2', name: 'Tier 2', minAmount: 1000, maxAmount: 5000, commissionRate: 0.12 },
  { id: '3', name: 'Tier 3', minAmount: 5000, maxAmount: 25000, commissionRate: 0.10 },
  { id: '4', name: 'Tier 4', minAmount: 25000, maxAmount: null, commissionRate: 0.08 },
];

export const useVendorStore = create<VendorState>((set, get) => ({
  vendor: null,
  isLoading: false,
  error: null,
  totalRevenue: 0,
  monthlyRevenue: 0,
  pendingPayout: 0,

  fetchVendor: async (vendorId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      
      const data = await response.json();
      
      set({
        vendor: data.vendor,
        totalRevenue: data.totalRevenue || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        pendingPayout: data.pendingPayout || 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vendor',
      });
    }
  },

  updateVendor: async (data: Partial<Vendor>) => {
    const { vendor } = get();
    if (!vendor) return;

    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`/api/vendors/${vendor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update vendor');
      
      const updatedVendor = await response.json();
      set({ vendor: updatedVendor, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update vendor',
      });
    }
  },

  getPayouts: async () => {
    const { vendor } = get();
    if (!vendor) return [];

    try {
      const response = await fetch(`/api/vendors/${vendor.id}/payouts`);
      if (!response.ok) throw new Error('Failed to fetch payouts');
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      return [];
    }
  },

  getDisputes: async () => {
    const { vendor } = get();
    if (!vendor) return [];

    try {
      const response = await fetch(`/api/vendors/${vendor.id}/disputes`);
      if (!response.ok) throw new Error('Failed to fetch disputes');
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      return [];
    }
  },

  getCommissionRate: (amount: number) => {
    const { vendor } = get();
    const tiers = vendor?.commission || DEFAULT_COMMISSION_TIERS;
    
    for (const tier of tiers) {
      if (amount >= tier.minAmount && (tier.maxAmount === null || amount < tier.maxAmount)) {
        return tier.commissionRate;
      }
    }
    
    return 0.10; // Default 10%
  },

  calculateEarnings: (salesAmount: number) => {
    const rate = get().getCommissionRate(salesAmount);
    const commission = salesAmount * rate;
    const net = salesAmount - commission;
    
    return {
      gross: salesAmount,
      commission,
      net,
    };
  },
}));

// Analytics store for vendor dashboard
interface AnalyticsState {
  period: '7d' | '30d' | '90d' | '365d';
  setPeriod: (period: '7d' | '30d' | '90d' | '365d') => void;
  
  salesData: Array<{ date: string; sales: number; orders: number }>;
  topProducts: Array<{ id: string; title: string; sales: number; views: number }>;
  recentOrders: Array<{ id: string; orderNumber: string; total: number; status: string; createdAt: string }>;
  
  fetchAnalytics: (vendorId: string) => Promise<void>;
}

export const useVendorAnalytics = create<AnalyticsState>((set, get) => ({
  period: '30d',
  setPeriod: (period) => {
    set({ period });
  },
  salesData: [],
  topProducts: [],
  recentOrders: [],

  fetchAnalytics: async (vendorId: string) => {
    const { period } = get();
    
    try {
      const response = await fetch(
        `/api/vendors/${vendorId}/analytics?period=${period}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      
      set({
        salesData: data.salesData,
        topProducts: data.topProducts,
        recentOrders: data.recentOrders,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  },
}));
