import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { KitchenService } from "../services/pos.service";
import type { KitchenOrder, KitchenOrderStatus } from "../types/pos.types";
import { motion, AnimatePresence } from "motion/react";

export default function KitchenDisplayScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [filter, setFilter] = useState<KitchenOrderStatus | "all">("all");

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await KitchenService.getKitchenOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load kitchen orders:", error);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: KitchenOrderStatus
  ) => {
    try {
      await KitchenService.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status: KitchenOrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-red-500/20 border-red-500 text-red-500";
      case "preparing":
        return "bg-amber-500/20 border-amber-500 text-amber-500";
      case "ready":
        return "bg-green-500/20 border-green-500 text-green-500";
      case "served":
        return "bg-blue-500/20 border-blue-500 text-blue-500";
    }
  };

  const getStatusLabel = (status: KitchenOrderStatus) => {
    switch (status) {
      case "pending":
        return "جديد";
      case "preparing":
        return "قيد التحضير";
      case "ready":
        return "جاهز";
      case "served":
        return "تم التقديم";
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#023047] to-[#001219]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--outline-variant)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/pos")}
              className="p-2 rounded-lg hover:bg-[var(--surface-variant)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--on-surface)]" />
            </button>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-cyan-400" />
              <h1
                className="font-['Almarai'] text-xl text-[var(--on-surface)]"
                dir="rtl"
              >
                شاشة المطبخ
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-['Almarai'] transition-colors ${
                filter === "all"
                  ? "bg-cyan-400 text-[#00373a]"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]"
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-['Almarai'] transition-colors ${
                filter === "pending"
                  ? "bg-red-500 text-white"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]"
              }`}
            >
              جديد ({orders.filter((o) => o.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("preparing")}
              className={`px-4 py-2 rounded-lg font-['Almarai'] transition-colors ${
                filter === "preparing"
                  ? "bg-amber-500 text-white"
                  : "bg-[var(--surface-variant)] text-[var(--on-surface-variant)]"
              }`}
            >
              قيد التحضير (
              {orders.filter((o) => o.status === "preparing").length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="text-[var(--on-surface-variant)] font-['Almarai']"
              dir="rtl"
            >
              لا توجد طلبات
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-['Inter'] text-xl">
                        {order.orderNumber}
                      </h3>
                      {order.tableNumber && (
                        <p
                          className="text-sm opacity-70 font-['Almarai']"
                          dir="rtl"
                        >
                          طاولة {order.tableNumber}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className="font-['Inter']">
                        {new Date(order.timestamp).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-['Almarai']" dir="rtl">
                            {item.product.name}
                          </span>
                          <span className="font-['Inter']">
                            ×{item.quantity}
                          </span>
                        </div>
                        {item.notes && (
                          <p
                            className="text-xs opacity-70 font-['Almarai'] mt-1"
                            dir="rtl"
                          >
                            {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-4 p-2 rounded-lg bg-black/20">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-xs font-['Almarai']" dir="rtl">
                          {order.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="space-y-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, "preparing")
                        }
                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-['Almarai'] transition-colors"
                      >
                        بدء التحضير
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, "ready")}
                        className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-['Almarai'] transition-colors"
                      >
                        جاهز للتقديم
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, "served")}
                        className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-['Almarai'] transition-colors"
                      >
                        تم التقديم
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
