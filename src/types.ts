export type PlatformId = 'instagram' | 'youtube' | 'facebook' | 'telegram' | 'twitter';

export interface ServiceOption {
  id: string;
  platform: PlatformId;
  name: string;
  category: 'followers' | 'views' | 'likes' | 'subscribers' | 'comments' | 'watchtime';
  description: string;
  pricePerUnit: number; // in INR per 1000 units or per pack
  minQuantity: number;
  maxQuantity: number;
  defaultQuantity: number;
  presetQuantities: number[];
  speed: string;
  startTime: string;
  guarantee: string;
  badge?: string;
  inputLabel: string;
  inputPlaceholder: string;
  inputType: 'username' | 'link';
  popular?: boolean;
  enabled?: boolean;
}

export interface OrderDetails {
  orderId: string;
  serviceId: string;
  serviceName: string;
  platform: PlatformId;
  quantity: number;
  targetUrl: string;
  totalPrice: number;
  createdAt: string;
  utrNumber?: string;
  status: 'pending_payment' | 'verifying' | 'processing' | 'in_progress' | 'completed';
  progress?: number;
}

export interface AdminContactInfo {
  phone: string;
  formattedPhone: string;
  whatsappUrl: string;
  upiId: string;
  secondaryUpiId: string;
  merchantName: string;
}
