import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TableService } from "../services/table.service";
import type {
  Table,
  Section,
  Floor,
  TableReservation,
  TableStats,
  TableStatus,
} from "../types/table.types";
import { MainNavigation } from "../../../components/main-navigation";
import { LoadingState } from "../../../components/loading-state";
import {
  Grid3x3,
  List,
  Search,
  X,
  Plus,
  Filter,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Armchair,
  DoorOpen,
  QrCode,
  ArrowRightLeft,
  Combine,
  Split,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ViewMode = "grid" | "list";

export default function TablesScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [tables, setTables] = useState<Table[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [stats, setStats] = useState<TableStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedStatuses, setSelectedStatuses] = useState<TableStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showReservations, setShowReservations] = useState(false);

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // ============================================================
  // DATA LOADING
  // ============================================================
  useEffect(() => {
    loadData();
  }, [selectedFloor, selectedSection, selectedStatuses, searchQuery]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        tablesData,
        sectionsData,
        floorsData,
        reservationsData,
        statsData,
      ] = await Promise.all([
        TableService.getTables({
          floor: selectedFloor !== "all" ? selectedFloor : undefined,
          section: selectedSection !== "all" ? selectedSection : undefined,
          status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
          search: searchQuery || undefined,
        }),
        TableService.getSections(),
        TableService.getFloors(),
        TableService.getReservations(),
        TableService.getTableStats(),
      ]);

      setTables(tablesData);
      setSections(sectionsData);
      setFloors(floorsData);
      setReservations(reservationsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading tables data:", error);
      showFeedback("حدث خطأ في تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setFeedback({ message, type });
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleStatusChange = async (
    tableId: string,
    newStatus: TableStatus
  ) => {
    try {
      await TableService.updateTableStatus(tableId, newStatus);
      await loadData();
      showFeedback("تم تحديث حالة الطاولة بنجاح", "success");
    } catch (error) {
      showFeedback("فشل تحديث حالة الطاولة", "error");
    }
  };

  const toggleStatusFilter = (status: TableStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return {
          bg: "from-[rgba(16,185,129,0.1)] to-[rgba(5,150,105,0.05)]",
          border: "border-green-400/30",
          text: "text-green-400",
          icon: <Circle className="w-3 h-3 fill-green-400" />,
        };
      case "occupied":
        return {
          bg: "from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)]",
          border: "border-red-400/30",
          text: "text-red-400",
          icon: <Circle className="w-3 h-3 fill-red-400" />,
        };
      case "reserved":
        return {
          bg: "from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)]",
          border: "border-orange-400/30",
          text: "text-orange-400",
          icon: <Circle className="w-3 h-3 fill-orange-400" />,
        };
      case "cleaning":
        return {
          bg: "from-[rgba(59,130,246,0.1)] to-[rgba(37,99,235,0.05)]",
          border: "border-blue-400/30",
          text: "text-blue-400",
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
        };
      default:
        return {
          bg: "from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)]",
          border: "border-[rgba(255,255,255,0.1)]",
          text: "text-[#c2c7ce]",
          icon: <Circle className="w-3 h-3" />,
        };
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "متاحة";
      case "occupied":
        return "مشغولة";
      case "reserved":
        return "محجوزة";
      case "cleaning":
        return "تنظيف";
      default:
        return "";
    }
  };

  const getSectionColor = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    return section?.color || "#22d3ee";
  };

  const getOccupiedDuration = (occupiedAt?: string) => {
    if (!occupiedAt) return "";
    const diff = Date.now() - new Date(occupiedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} س ${remainingMinutes} د`;
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#00161a] flex flex-col pr-20" dir="rtl">
      <MainNavigation />

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-md ${
                feedback.type === "success"
                  ? "bg-green-500/90 text-white"
                  : feedback.type === "error"
                  ? "bg-red-500/90 text-white"
                  : "bg-cyan-400/90 text-[#00373a]"
              }`}
            >
              <p className="font-['Almarai'] font-bold" dir="auto">
                {feedback.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#001f24] to-[#00161a] border-b border-[rgba(255,255,255,0.1)] px-6 py-6">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-['Almarai'] font-bold text-[#e2e2e6] mb-1">
                إدارة الطاولات
              </h1>
              <p className="text-sm font-['Almarai'] text-[#c2c7ce]">
                تنظيم ومتابعة طاولات المطعم
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReservations(!showReservations)}
                className="relative px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-['Almarai']">الحجوزات</span>
                  {reservations.length > 0 && (
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-['Arial'] font-bold text-[#00373a]">
                      {reservations.length}
                    </span>
                  )}
                </div>
              </button>
              <button className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg transition-all">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">
                    طاولة جديدة
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Armchair className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    إجمالي الطاولات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-cyan-400 text-right">
                  {stats.total}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(16,185,129,0.1)] to-[rgba(5,150,105,0.05)] border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    متاحة
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-green-400 text-right">
                  {stats.available}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)] border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    مشغولة
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-red-400 text-right">
                  {stats.occupied}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    محجوزة
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-orange-400 text-right">
                  {stats.reserved}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(59,130,246,0.1)] to-[rgba(37,99,235,0.05)] border border-blue-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    تنظيف
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-blue-400 text-right">
                  {stats.cleaning}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)] border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    معدل الإشغال
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-purple-400 text-right">
                  {stats.occupancyRate.toFixed(0)}%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    متوسط الدورة
                  </span>
                </div>
                <p className="text-xl font-['Arial'] font-bold text-cyan-400 text-right">
                  {stats.averageTurnover} د
                </p>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex gap-3 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#c2c7ce]" />
              <input
                type="text"
                placeholder="ابحث عن طاولة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-12 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c2c7ce] hover:text-[#e2e2e6]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Floor Filter */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors"
              dir="rtl"
            >
              <option value="all">كل الطوابق</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors"
              dir="rtl"
            >
              <option value="all">كل الأقسام</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-400 text-[#00373a]"
                    : "text-[#c2c7ce] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-400 text-[#00373a]"
                    : "text-[#c2c7ce] hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {(
              ["available", "occupied", "reserved", "cleaning"] as TableStatus[]
            ).map((status) => {
              const statusColor = getStatusColor(status);
              const isSelected = selectedStatuses.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${statusColor.bg} ${statusColor.border} ${statusColor.text}`
                      : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/30"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {statusColor.icon}
                    <span className="text-xs font-['Almarai'] font-bold">
                      {getStatusLabel(status)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tables Content */}
        <div className="flex-1 px-6 py-4 overflow-auto">
          <LoadingState loading={loading}>
            {viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {tables.map((table, index) => {
                  const statusColor = getStatusColor(table.status);
                  const sectionColor = getSectionColor(table.section);
                  const section = sections.find((s) => s.id === table.section);

                  return (
                    <motion.div
                      key={table.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`relative p-4 rounded-2xl bg-gradient-to-br ${statusColor.bg} border ${statusColor.border} hover:scale-105 transition-all cursor-pointer group`}
                      onClick={() => setSelectedTable(table)}
                    >
                      {/* VIP Badge */}
                      {table.isVIP && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-['Arial'] font-bold text-white">
                            VIP
                          </span>
                        </div>
                      )}

                      {/* Table Number */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${sectionColor}33, ${sectionColor}11)`,
                            borderColor: `${sectionColor}44`,
                            borderWidth: "1px",
                          }}
                        >
                          <Armchair
                            className="w-6 h-6"
                            style={{ color: sectionColor }}
                          />
                        </div>
                        {statusColor.icon}
                      </div>

                      <h3 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-1">
                        {table.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-[#c2c7ce] mb-2">
                        <span className="font-['Almarai']">
                          {section?.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="font-['Arial']">
                            {table.capacity}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`text-xs font-['Almarai'] font-bold ${statusColor.text}`}
                      >
                        {getStatusLabel(table.status)}
                      </div>

                      {table.status === "occupied" && table.occupiedAt && (
                        <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)] flex items-center gap-1 text-xs text-[#c2c7ce]">
                          <Clock className="w-3 h-3" />
                          <span className="font-['Arial']">
                            {getOccupiedDuration(table.occupiedAt)}
                          </span>
                        </div>
                      )}

                      {table.status === "reserved" && table.reservedBy && (
                        <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)] text-xs">
                          <p className="text-[#c2c7ce] font-['Almarai']">
                            محجوزة لـ:{" "}
                            <span className="text-[#e2e2e6] font-bold">
                              {table.reservedBy}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pos?table=${table.id}`);
                          }}
                          className="p-2 rounded-lg bg-cyan-400 text-[#00373a] hover:bg-cyan-500 transition-all"
                          title="فتح في نقطة البيع"
                        >
                          <DoorOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-2 rounded-lg bg-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:bg-[rgba(255,255,255,0.2)] transition-all"
                          title="رمز QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {table.status === "occupied" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(table.id, "available");
                            }}
                            className="p-2 rounded-lg bg-green-400 text-[#00373a] hover:bg-green-500 transition-all"
                            title="إغلاق الطاولة"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="bg-[rgba(255,255,255,0.03)] rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[rgba(255,255,255,0.05)]">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الطاولة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        القسم
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        السعة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        المدة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table, index) => {
                      const statusColor = getStatusColor(table.status);
                      const section = sections.find(
                        (s) => s.id === table.section
                      );

                      return (
                        <motion.tr
                          key={table.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-t border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${getSectionColor(
                                    table.section
                                  )}33, ${getSectionColor(table.section)}11)`,
                                }}
                              >
                                <Armchair
                                  className="w-5 h-5"
                                  style={{
                                    color: getSectionColor(table.section),
                                  }}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-['Almarai'] font-bold text-[#e2e2e6]">
                                    {table.name}
                                  </p>
                                  {table.isVIP && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-['Arial'] font-bold bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white">
                                      VIP
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#c2c7ce] font-['Almarai']">
                                  {table.number}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                              {section?.name}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="w-4 h-4 text-[#c2c7ce]" />
                              <span className="font-['Arial'] text-[#e2e2e6]">
                                {table.capacity}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${statusColor.bg} border ${statusColor.border}`}
                            >
                              {statusColor.icon}
                              <span
                                className={`text-sm font-['Almarai'] font-bold ${statusColor.text}`}
                              >
                                {getStatusLabel(table.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {table.occupiedAt && (
                              <span className="font-['Arial'] text-[#c2c7ce] text-sm">
                                {getOccupiedDuration(table.occupiedAt)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/pos?table=${table.id}`)
                                }
                                className="p-2 rounded-lg bg-cyan-400 text-[#00373a] hover:bg-cyan-500 transition-all"
                                title="فتح في نقطة البيع"
                              >
                                <DoorOpen className="w-4 h-4" />
                              </button>
                              {table.status === "occupied" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(table.id, "available")
                                  }
                                  className="p-2 rounded-lg bg-green-400 text-[#00373a] hover:bg-green-500 transition-all"
                                  title="إغلاق"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </LoadingState>
        </div>
      </div>
    </div>
  );
}
