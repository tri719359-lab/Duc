import React from 'react';
import { RestaurantStats } from '../types/game';
import { Trophy, AlertOctagon, Sparkles, ArrowRight, ShoppingBag, Shirt } from 'lucide-react';
import { sound } from '../services/sound';

interface DaySummaryModalProps {
  stats: RestaurantStats;
  onNextDay: () => void;
  onOpenUpgrades: () => void;
  onOpenWardrobe: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  stats,
  onNextDay,
  onOpenUpgrades,
  onOpenWardrobe,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-amber-950 border-2 border-amber-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-amber-50 text-center animate-scaleIn">
        {/* Day Crown / Trophy */}
        <div className="w-16 h-16 rounded-3xl bg-amber-800 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
          🏆
        </div>

        <h2 className="text-2xl font-black text-amber-100">
          Tổng Kết Ngày Thứ {stats.day}
        </h2>
        <p className="text-xs text-amber-300 mt-1">
          Một ngày tất bật bán phở tại Tiệm Phở Vui Vẻ đã khép lại!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 text-left">
          <div className="bg-amber-900/60 p-3 rounded-2xl border border-amber-700/60">
            <span className="text-[11px] text-amber-300 font-semibold block">
              Tiền thu được hôm nay
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              +{stats.totalEarnedToday.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-amber-900/60 p-3 rounded-2xl border border-amber-700/60">
            <span className="text-[11px] text-amber-300 font-semibold block">
              Số khách ăn no nê
            </span>
            <span className="text-lg font-black text-amber-200 font-mono">
              {stats.customersServed} vị khách
            </span>
          </div>

          <div className="bg-amber-900/60 p-3 rounded-2xl border border-amber-700/60">
            <span className="text-[11px] text-amber-300 font-semibold block">
              Tô phở nấu hoàn hảo 100%
            </span>
            <span className="text-lg font-black text-amber-300 font-mono flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {stats.perfectOrders}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border ${
            stats.tablesSlammed > 0
              ? 'bg-red-950/70 border-red-500/80 text-red-200'
              : 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
          }`}>
            <span className="text-[11px] font-semibold block">
              Khách đập bàn bỏ đi
            </span>
            <span className="text-lg font-black font-mono flex items-center gap-1">
              {stats.tablesSlammed > 0 && <AlertOctagon className="w-4 h-4 text-red-400" />}
              {stats.tablesSlammed} lần
            </span>
          </div>
        </div>

        {/* Evaluation Message */}
        <div className="p-3 bg-amber-900/40 rounded-xl border border-amber-800 text-xs text-amber-200 mb-5">
          {stats.tablesSlammed === 0 ? (
            <p className="text-emerald-300 font-medium">
              🌟 Tuyệt vời! Không có ai phải đợi quá 5 phút hay đập bàn bỏ đi cả! Khách quen khen nức nở!
            </p>
          ) : (
            <p className="text-rose-300 font-medium">
              ⚠️ Có {stats.tablesSlammed} khách đã đập bàn bỏ đi vì đợi quá lâu! Nhớ chú ý mời trà đá hoặc tăng tốc độ trụng phở nhé!
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenWardrobe();
            }}
            className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-amber-900/80 hover:bg-amber-800 border border-amber-700 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Shirt className="w-4 h-4" />
            <span>Tủ đồ áo quần</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenUpgrades();
            }}
            className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 border border-amber-600 text-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Nâng cấp quán</span>
          </button>

          <button
            onClick={() => {
              sound.playUpgradeFanfare();
              onNextDay();
            }}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg"
          >
            <span>Mở ngày {stats.day + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
