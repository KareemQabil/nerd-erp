import React from "react";
import type { StockAlert } from "../types/inventory.types";
import { AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { motion } from "motion/react";

interface StockAlertCardProps {
  alert: StockAlert;
  onAcknowledge: (alertId: string) => void;
}

export function StockAlertCard({ alert, onAcknowledge }: StockAlertCardProps) {
  const getAlertIcon = () => {
    switch (alert.alertType) {
      case "out-of-stock":
        return <AlertTriangle className="w-5 h-5" />;
      case "low-stock":
        return <AlertCircle className="w-5 h-5" />;
      case "expiring":
        return <Info className="w-5 h-5" />;
      case "overstock":
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.severity) {
      case "high":
        return "from-red-500/20 to-red-600/10 border-red-500/50 text-red-400";
      case "medium":
        return "from-orange-500/20 to-orange-600/10 border-orange-500/50 text-orange-400";
      case "low":
        return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 text-yellow-400";
    }
  };

  const getAlertTitle = () => {
    switch (alert.alertType) {
      case "out-of-stock":
        return "نفذ من المخزون";
      case "low-stock":
        return "مخزون منخفض";
      case "expiring":
        return "قرب انتهاء الصلاحية";
      case "overstock":
        return "مخزون زائد";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-xl bg-linear-to-br border ${getAlertColor()} ${
        alert.acknowledged ? "opacity-50" : ""
      }`}
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getAlertIcon()}</div>
        <div className="flex-1">
          <h4 className="font-['Almarai'] font-bold text-[#e2e2e6] mb-1 text-right">
            {alert.productName}
          </h4>
          <p className="text-sm font-['Almarai'] mb-2 text-right">
            {getAlertTitle()}
          </p>
          <div className="flex items-center gap-4 text-xs font-['Almarai'] text-[#c2c7ce]">
            <span>
              الحالي:{" "}
              <span className="font-['Arial'] font-bold">
                {alert.currentStock}
              </span>
            </span>
            <span>
              الحد:{" "}
              <span className="font-['Arial'] font-bold">
                {alert.threshold}
              </span>
            </span>
            <span>
              {new Intl.DateTimeFormat("ar-SA", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(alert.createdAt)}
            </span>
          </div>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            title="وضع علامة كمقروء"
          >
            <Check className="w-4 h-4 text-[#c2c7ce]" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
