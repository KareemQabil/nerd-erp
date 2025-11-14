/**
 * Dashboard Screen
 * NerdPOS - Matching POS Screen Design
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainNavigation } from '../../../components/main-navigation';
import { 
  TrendingUp, ShoppingCart, Package, Users, DollarSign,
  AlertTriangle, Clock, CheckCircle, ArrowUpRight, BarChart3, Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { NerdPOSColors } from '../../../core/theme/nerdpos-styles';

export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const stats = [
    { id: 1, value: '12,450', unit: isRTL ? 'ر.س' : 'SAR', label: isRTL ? 'مبيعات اليوم' : 'Today Sales', icon: DollarSign, color: '#10b981', change: '+12%' },
    { id: 2, value: '45', unit: isRTL ? 'طلب' : 'Orders', label: isRTL ? 'الطلبات' : 'Orders', icon: ShoppingCart, color: '#22d3ee', change: '+8%' },
    { id: 3, value: '342', unit: isRTL ? 'منتج' : 'Products', label: isRTL ? 'المنتجات' : 'Products', icon: Package, color: '#8b5cf6', change: '+5%' },
    { id: 4, value: '1,250', unit: isRTL ? 'عميل' : 'Customers', label: isRTL ? 'العملاء' : 'Customers', icon: Users, color: '#f59e0b', change: '+2%' },
  ];

  const recentNotifications = [
    { id: 1, title: isRTL ? 'طلب جديد ORD-0458' : 'New order ORD-0458', time: isRTL ? 'منذ 5 دقائق' : '5 mins ago', icon: ShoppingCart, color: '#22d3ee' },
    { id: 2, title: isRTL ? 'تحديث المخزون' : 'Stock updated', time: isRTL ? 'منذ 15 دقيقة' : '15 mins ago', icon: Package, color: '#22d3ee' },
    { id: 3, title: isRTL ? 'عميل جديد' : 'New customer', time: isRTL ? 'منذ 30 دقيقة' : '30 mins ago', icon: Users, color: '#22d3ee' },
  ];

  const alerts = [
    { id: 1, message: isRTL ? '15 منتج مخزون منخفض' : '15 products low in stock', icon: AlertTriangle, color: '#f59e0b' },
    { id: 2, message: isRTL ? '5 طلبات قيد التحضير' : '5 orders in preparation', icon: Clock, color: '#22d3ee' },
    { id: 3, message: isRTL ? '25 طلب تم تسليمه اليوم' : '25 orders delivered today', icon: CheckCircle, color: '#10b981' },
  ];

  return (
    <div 
      className="min-h-screen" 
      style={{ background: NerdPOSColors.background.gradient }}
    >
      <MainNavigation />

      <div className="pt-6 pb-24 px-4" style={{ marginRight: '80px' }} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6] mb-1 text-right" dir="auto">
            {isRTL ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-base text-[#c2c7ce] font-['Almarai'] text-right" dir="auto">
            {isRTL ? 'نظرة عامة على أداء المتجر اليوم' : 'Overview of store performance today'}
          </p>
        </div>

        {/* Stats Grid - Matching POS design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-xl p-4"
              >
                {/* Header: Change Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="px-2 py-1 rounded-md flex items-center gap-1"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span className="text-xs font-['Inter'] font-medium text-green-400">
                      {stat.change}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-green-400" />
                  </div>
                  
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>

                {/* Label */}
                <div className="text-sm font-['Almarai'] text-[#c2c7ce] mb-2 text-right" dir="auto">
                  {stat.label}
                </div>

                {/* Value */}
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-['Inter'] font-bold text-[#e2e2e6]">
                    {stat.value}
                  </span>
                  <span className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1" dir="auto">
                    {stat.unit}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Recent Notifications */}
          <div className="bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]" dir="auto">
                {isRTL ? 'الإشعارات الأخيرة' : 'Recent Notifications'}
              </h2>
            </div>

            <div className="space-y-3">
              {recentNotifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 flex items-center gap-3 hover:border-cyan-400/30 transition-all cursor-pointer"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-['Almarai'] text-[#e2e2e6] mb-1 text-right" dir="auto">
                        {notification.title}
                      </p>
                      <p className="text-xs font-['Almarai'] text-[#c2c7ce] text-right" dir="auto">
                        {notification.time}
                      </p>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: notification.color }}
                    >
                      <Icon className="w-4 h-4 text-[#001219]" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]" dir="auto">
                {isRTL ? 'التنبيهات' : 'Alerts'}
              </h2>
            </div>

            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      backgroundColor: `${alert.color}10`,
                      border: `1px solid ${alert.color}20`
                    }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${alert.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: alert.color }} />
                    </div>
                    <p className="text-sm font-['Almarai'] flex-1" style={{ color: '#e2e2e6' }} dir="auto">
                      {alert.message}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Coming Soon */}
        <div className="bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-xl p-12 text-center">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
          >
            <BarChart3 className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-xl font-['Almarai'] font-bold text-[#e2e2e6] mb-2" dir="auto">
            {isRTL ? 'الرسوم البيانية قريباً' : 'Charts Coming Soon'}
          </h2>
          <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
            {isRTL ? 'جاري العمل على إضافة المزيد من التقارير والتحليلات المرئية' : 'Working on adding more visual reports and analytics'}
          </p>
        </div>
      </div>
    </div>
  );
}