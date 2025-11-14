import React from 'react';
import { Order } from '../types/orders.types';
import { Clock, MapPin, User, ShoppingBag, CreditCard, Phone } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: Order['status']) => void;
}

const statusConfig = {
  pending: { label: 'قيد الانتظار', labelEn: 'Pending', color: 'bg-amber-500/20 text-amber-700' },
  preparing: { label: 'قيد التحضير', labelEn: 'Preparing', color: 'bg-blue-500/20 text-blue-700' },
  ready: { label: 'جاهز', labelEn: 'Ready', color: 'bg-green-500/20 text-green-700' },
  completed: { label: 'مكتمل', labelEn: 'Completed', color: 'bg-gray-500/20 text-gray-700' },
  cancelled: { label: 'ملغي', labelEn: 'Cancelled', color: 'bg-red-500/20 text-red-700' }
};

const typeConfig = {
  dineIn: { label: 'صالة الطعام', labelEn: 'Dine In', icon: ShoppingBag },
  takeaway: { label: 'طلب خارجي', labelEn: 'Takeaway', icon: ShoppingBag },
  delivery: { label: 'توصيل', labelEn: 'Delivery', icon: MapPin }
};

const paymentStatusConfig = {
  paid: { label: 'مدفوع', labelEn: 'Paid', color: 'text-green-600' },
  unpaid: { label: 'غير مدفوع', labelEn: 'Unpaid', color: 'text-red-600' },
  partial: { label: 'مدفوع جزئياً', labelEn: 'Partial', color: 'text-amber-600' },
  refunded: { label: 'مسترد', labelEn: 'Refunded', color: 'text-gray-600' }
};

export function OrderCard({ order, onViewDetails, onUpdateStatus }: OrderCardProps) {
  const statusInfo = statusConfig[order.status];
  const typeInfo = typeConfig[order.type];
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const TypeIcon = typeInfo.icon;
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    
    return date.toLocaleDateString('ar-SA', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetails(order)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--primary-container)] text-[var(--primary)] px-3 py-1 rounded-lg font-inter">
            {order.orderNumber}
          </div>
          <Badge className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-[var(--on-surface-variant)] text-sm">
          <Clock className="w-4 h-4" />
          <span className="font-inter">{formatTime(order.createdAt)}</span>
        </div>
      </div>
      
      {/* Order Type & Info */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <TypeIcon className="w-4 h-4 text-[var(--primary)]" />
          <span>{typeInfo.label}</span>
        </div>
        
        {order.tableNumber && (
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--primary)]" />
            <span>طاولة {order.tableNumber}</span>
          </div>
        )}
        
        {order.customerName && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--primary)]" />
            <span>{order.customerName}</span>
          </div>
        )}
      </div>
      
      {/* Items Summary */}
      <div className="mb-4 pb-4 border-b border-[var(--outline-variant)]">
        <p className="text-sm text-[var(--on-surface-variant)] mb-2">
          {order.items.length} منتج
        </p>
        <div className="space-y-1">
          {order.items.slice(0, 2).map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>
                <span className="font-inter text-[var(--primary)] ml-1">{item.quantity}x</span>
                {item.productName}
              </span>
              <span className="font-inter text-[var(--on-surface-variant)]">
                {item.total.toFixed(2)} ر.س
              </span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-[var(--on-surface-variant)]">
              و {order.items.length - 2} منتج آخر...
            </p>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--on-surface-variant)] mb-1">الإجمالي</p>
          <p className="font-inter text-[var(--primary)]">
            {order.total.toFixed(2)} ر.س
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CreditCard className={`w-4 h-4 ${paymentInfo.color}`} />
          <span className={`text-sm ${paymentInfo.color}`}>
            {paymentInfo.label}
          </span>
        </div>
      </div>
      
      {/* Quick Actions */}
      {onUpdateStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
        <div className="mt-4 pt-4 border-t border-[var(--outline-variant)] flex gap-2">
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'preparing');
              }}
            >
              بدء التحضير
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'ready');
              }}
            >
              جاهز
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, 'completed');
              }}
            >
              إتمام الطلب
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
