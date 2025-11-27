import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Table } from "../types/pos.types";
import { TableService } from "../services/pos.service";
import { SyncService } from "../../../core/services/sync.service";
import {
  ArrowRight,
  Users,
  Clock,
  DollarSign,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TableFormModal } from "../components/table-form-modal";

export default function TablesScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Table["status"]>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    loadTables();

    // Subscribe to table sync events for real-time updates
    const unsubscribeOccupied = SyncService.subscribe(
      "table_occupied",
      (event) => {
        console.log("🪑 Table occupied event received:", event.data);
        loadTables(); // Reload tables to reflect changes
      }
    );

    const unsubscribeFreed = SyncService.subscribe("table_freed", (event) => {
      console.log("🪑 Table freed event received:", event.data);
      loadTables(); // Reload tables to reflect changes
    });

    const unsubscribeUpdated = SyncService.subscribe(
      "table_updated",
      (event) => {
        console.log("🪑 Table updated event received:", event.data);
        loadTables(); // Reload tables to reflect changes
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeOccupied();
      unsubscribeFreed();
      unsubscribeUpdated();
    };
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await TableService.getTables();
      setTables(data);
    } catch (error) {
      console.error("Error loading tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "from-[#10b981] to-[#059669]";
      case "occupied":
        return "from-[#ef4444] to-[#dc2626]";
      case "reserved":
        return "from-[#f59e0b] to-[#d97706]";
      case "cleaning":
        return "from-[#6b7280] to-[#4b5563]";
      default:
        return "from-[#42474e] to-[#2a2f35]";
    }
  };

  const formatDuration = (startTime?: Date) => {
    if (!startTime) return "";
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const filteredTables =
    filter === "all" ? tables : tables.filter((t) => t.status === filter);

  const stats = {
    total: tables.length,
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  };

  const groupedTables = filteredTables.reduce((acc, table) => {
    const zone = table.zone || "other";
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  const handleSaveTable = async (table: Partial<Table>) => {
    try {
      if (table.id) {
        await TableService.updateTable(table);
        setFeedback({ message: "تم تحديث الطاولة بنجاح", type: "success" });
      } else {
        await TableService.createTable(table);
        setFeedback({ message: "تم إضافة الطاولة بنجاح", type: "success" });
      }
      await loadTables();
      setShowModal(false);
      setSelectedTable(null);
    } catch (error) {
      setFeedback({ message: "فشل حفظ الطاولة", type: "error" });
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الطاولة؟")) return;
    try {
      await TableService.deleteTable(tableId);
      setFeedback({ message: "تم حذف الطاولة بنجاح", type: "success" });
      await loadTables();
    } catch (error: any) {
      setFeedback({
        message: error.message || "فشل حذف الطاولة",
        type: "error",
      });
    }
  };

  const handleChangeStatus = async (
    tableId: string,
    status: Table["status"]
  ) => {
    try {
      await TableService.updateTableStatus(tableId, status);
      setFeedback({ message: "تم تغيير حالة الطاولة", type: "success" });
      await loadTables();
    } catch (error) {
      setFeedback({ message: "فشل تغيير الحالة", type: "error" });
    }
  };

  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setShowModal(true);
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#023047] to-[#001219]">
      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
              feedback.type === "success"
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            <p className="text-sm font-['Almarai'] font-bold" dir="auto">
              {feedback.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-4">
          <div className="h-18 flex items-center justify-between">
            <button
              onClick={() => navigate("/pos")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#c2c7ce]" />
              <span className="font-['Almarai'] text-[#c2c7ce]" dir="auto">
                رجوع
              </span>
            </button>

            <h1
              className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6]"
              dir="auto"
            >
              {t("pos.tableManagement")}
            </h1>

            <button className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <Settings className="w-5 h-5 text-[#c2c7ce]" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-linear-to-b from-[#1a1c1e] via-[#1d2222] to-[#42474e] rounded-2xl p-4 border border-[#42474e]">
            <p
              className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              إجمالي الطاولات
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#e2e2e6]">
              {stats.total}
            </p>
          </div>
          <div className="bg-linear-to-b from-[rgba(16,185,129,0.2)] to-[rgba(5,150,105,0.2)] rounded-2xl p-4 border border-[#10b981]">
            <p
              className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              متاحة
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#10b981]">
              {stats.available}
            </p>
          </div>
          <div className="bg-linear-to-b from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] rounded-2xl p-4 border border-[#ef4444]">
            <p
              className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              مشغولة
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#ef4444]">
              {stats.occupied}
            </p>
          </div>
          <div className="bg-linear-to-b from-[rgba(245,158,11,0.2)] to-[rgba(217,119,6,0.2)] rounded-2xl p-4 border border-[#f59e0b]">
            <p
              className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              محجوزة
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#f59e0b]">
              {stats.reserved}
            </p>
          </div>
          <div className="bg-linear-to-b from-[rgba(107,114,128,0.2)] to-[rgba(75,85,99,0.2)] rounded-2xl p-4 border border-[#6b7280]">
            <p
              className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              تنظيف
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#6b7280]">
              {stats.cleaning}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-cyan-400 text-[#00373a]"
                : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
            }`}
          >
            <span dir="auto">الكل ({stats.total})</span>
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
              filter === "available"
                ? "bg-cyan-400 text-[#00373a]"
                : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
            }`}
          >
            <span dir="auto">متاحة ({stats.available})</span>
          </button>
          <button
            onClick={() => setFilter("occupied")}
            className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
              filter === "occupied"
                ? "bg-cyan-400 text-[#00373a]"
                : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
            }`}
          >
            <span dir="auto">مشغولة ({stats.occupied})</span>
          </button>
          <button
            onClick={() => setFilter("reserved")}
            className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
              filter === "reserved"
                ? "bg-cyan-400 text-[#00373a]"
                : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
            }`}
          >
            <span dir="auto">محجوزة ({stats.reserved})</span>
          </button>
        </div>

        {/* Tables by Zone */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
              {t("common.loading")}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTables).map(([zone, zoneTables]) => (
              <div key={zone}>
                {/* Zone Header */}
                <h2
                  className="text-xl font-['Almarai'] font-bold text-[#e2e2e6] mb-4 capitalize"
                  dir="auto"
                >
                  {zone === "indoor"
                    ? "داخلي"
                    : zone === "outdoor"
                    ? "خارجي"
                    : zone === "vip"
                    ? "VIP"
                    : zone}
                  <span className="text-sm text-[#c2c7ce] mr-2">
                    ({zoneTables.length})
                  </span>
                </h2>

                {/* Tables Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {zoneTables.map((table, index) => (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative bg-linear-to-b ${
                        table.status === "available"
                          ? "from-[rgba(16,185,129,0.2)] to-[rgba(5,150,105,0.2)] border-[#10b981]"
                          : table.status === "occupied"
                          ? "from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] border-[#ef4444]"
                          : table.status === "reserved"
                          ? "from-[rgba(245,158,11,0.2)] to-[rgba(217,119,6,0.2)] border-[#f59e0b]"
                          : "from-[rgba(107,114,128,0.2)] to-[rgba(75,85,99,0.2)] border-[#6b7280]"
                      } border rounded-2xl p-6 hover:transform hover:scale-105 transition-all`}
                    >
                      {/* Action Buttons */}
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTable(table);
                          }}
                          className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTable(table.id);
                          }}
                          disabled={table.status === "occupied"}
                          className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`absolute top-3 right-3 w-4 h-4 rounded-full bg-linear-to-b ${getStatusColor(
                          table.status
                        )}`}
                      />

                      {/* Table Number */}
                      <div className="text-center mb-4">
                        <span className="text-4xl font-['Arial'] font-bold text-[#e2e2e6]">
                          {table.number}
                        </span>
                      </div>

                      {/* Table Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-[#c2c7ce]">
                          <Users className="w-4 h-4" />
                          <span className="font-['Arial']">
                            {table.guestCount || 0}/{table.capacity}
                          </span>
                        </div>

                        {table.status === "occupied" && (
                          <>
                            {table.currentBill && (
                              <div className="bg-[rgba(239,68,68,0.2)] rounded-lg py-1 px-2 flex items-center justify-center gap-1">
                                <DollarSign className="w-3 h-3 text-[#ef4444]" />
                                <span className="text-sm font-['Arial'] font-bold text-[#ef4444]">
                                  {table.currentBill.toFixed(2)}
                                </span>
                              </div>
                            )}
                            {table.startTime && (
                              <div className="bg-[rgba(245,158,11,0.2)] rounded-lg py-1 px-2 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-[#f59e0b]" />
                                <span className="text-sm font-['Arial'] font-bold text-[#f59e0b]">
                                  {formatDuration(table.startTime)}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Status Label */}
                        <div
                          className="text-sm font-['Almarai'] text-center pt-2 border-t border-[rgba(255,255,255,0.1)]"
                          dir="auto"
                        >
                          {t(`pos.tableStatus.${table.status}`)}
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-2 flex gap-2">
                          {table.status === "available" && (
                            <button
                              onClick={() =>
                                navigate("/pos", {
                                  state: {
                                    tableId: table.id,
                                    tableNumber: table.number,
                                  },
                                })
                              }
                              className="flex-1 px-3 py-2 rounded-lg bg-cyan-400 text-[#00373a] hover:bg-cyan-500 transition-colors text-xs font-['Almarai'] font-bold"
                            >
                              فتح الطاولة
                            </button>
                          )}
                          {table.status === "occupied" && (
                            <button
                              onClick={() =>
                                navigate("/pos", {
                                  state: {
                                    tableId: table.id,
                                    tableNumber: table.number,
                                    closeTable: true,
                                  },
                                })
                              }
                              className="flex-1 px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-xs font-['Almarai'] font-bold"
                            >
                              إغلاق الطاولة
                            </button>
                          )}
                          {(table.status === "available" ||
                            table.status === "cleaning") && (
                            <button
                              onClick={() =>
                                handleChangeStatus(
                                  table.id,
                                  table.status === "available"
                                    ? "reserved"
                                    : "available"
                                )
                              }
                              className="flex-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-[#e2e2e6] transition-colors text-xs font-['Almarai'] font-bold"
                            >
                              {table.status === "available" ? "حجز" : "متاحة"}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Table Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 p-4 rounded-full bg-cyan-400 text-[#00373a] shadow-lg hover:bg-cyan-500 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Table Form Modal */}
      <AnimatePresence>
        {showModal && (
          <TableFormModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedTable(null);
            }}
            onSave={handleSaveTable}
            table={selectedTable}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
