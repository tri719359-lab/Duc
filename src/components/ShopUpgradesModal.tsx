import React, { useState } from 'react';
import { ShopUpgrade } from '../types/game';
import { Sparkles, Check, X, ArrowUpCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { sound } from '../services/sound';

interface ShopUpgradesModalProps {
  money: number;
  hasReached1Million?: boolean;
  upgrades: ShopUpgrade[];
  onBuyUpgrade: (upgradeId: string) => void;
  onClose: () => void;
}

export const ShopUpgradesModal: React.FC<ShopUpgradesModalProps> = ({
  money,
  hasReached1Million = false,
  upgrades,
  onBuyUpgrade,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tables_decor' | 'kitchen_speed' | 'customer_happiness' | 'luxury_prestige' | 'delivery_online'>('all');

  const handlePurchase = (id: string, cost: number, isLocked: boolean) => {
    if (isLocked) return;
    if (money >= cost) {
      sound.playUpgradeFanfare();
      onBuyUpgrade(id);
    }
  };

  const filteredUpgrades = upgrades.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const purchasedCount = upgrades.filter((u) => u.purchased).length;
  const totalCount = upgrades.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-amber-950 border-2 border-amber-600 rounded-3xl max-w-4xl w-full p-6 shadow-2xl text-amber-50 relative max-h-[92vh] flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-amber-900/80 hover:bg-amber-800 text-amber-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Wallet Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-800 rounded-2xl text-amber-300">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-amber-100 flex items-center gap-2">
                  Siêu Thị Nâng Cấp Tiệm Phở Vui Vẻ
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-800 text-amber-300 border border-amber-700">
                    Sở hữu: {purchasedCount}/{totalCount}
                  </span>
                </h2>
                <p className="text-xs text-amber-300">
                  {hasReached1Million ? (
                    <span className="text-emerald-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      ĐÃ MỞ KHÓA MỐC 1 TRIỆU: Có thể mua gói 5 Triệu đưa tiệm lên app shipper!
                    </span>
                  ) : (
                    <span>
                      Đạt mốc tích lũy <strong>1.000.000đ</strong> để tự động mở khóa các gói đại gia & shipper giao hàng!
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-amber-900/90 border border-amber-700/80 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-xs text-amber-300 font-medium">Tiền hiện có:</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {money.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-amber-800/80 no-scrollbar">
            {[
              { id: 'all', label: 'Tất Cả Món Đồ' },
              { id: 'delivery_online', label: '🛵 Giao Hàng & Shipper' },
              { id: 'tables_decor', label: '🪑 Bàn Ghế & Quán' },
              { id: 'kitchen_speed', label: '🍳 Bếp & Dụng Cụ' },
              { id: 'customer_happiness', label: '🧊 Chăm Sóc Khách' },
              { id: 'luxury_prestige', label: '👑 Thượng Lưu VIP' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-amber-950 shadow-md scale-105'
                    : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800 border border-amber-800/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upgrades Scrollable Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredUpgrades.map((item) => {
              const isLocked = Boolean(item.requiredUnlockAmount && !hasReached1Million);
              const canAfford = money >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    item.purchased
                      ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-100'
                      : isLocked
                      ? 'bg-slate-950/60 border-amber-700/40 opacity-75 ring-1 ring-amber-900/30'
                      : canAfford
                      ? 'bg-amber-900/60 border-amber-500/80 hover:border-amber-300 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-amber-950/60 border-amber-800/60 opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl shrink-0 p-2 bg-amber-950/80 rounded-2xl border border-amber-800/80">
                      {isLocked ? '🔒' : item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h3 className="text-sm font-bold text-amber-100 leading-tight">
                          {item.name}
                        </h3>
                        {item.purchased && (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Đã Sở Hữu
                          </span>
                        )}
                        {!item.purchased && isLocked && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-600/60 flex items-center gap-0.5">
                            🔒 Khóa (Cần đạt 1 Triệu)
                          </span>
                        )}
                        {!item.purchased && !isLocked && item.requiredUnlockAmount && (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-600/70 flex items-center gap-0.5">
                            ✨ Đã Mở Khóa Mốc 1M
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-amber-800/60 flex items-center justify-between">
                    <div className="text-xs font-mono font-bold">
                      {item.purchased ? (
                        <span className="text-emerald-400">Đang hoạt động tự động</span>
                      ) : isLocked ? (
                        <span className="text-amber-500/80">
                          Yêu cầu: Đạt 1.000.000đ để mở
                        </span>
                      ) : (
                        <span className={canAfford ? 'text-amber-300 font-extrabold' : 'text-amber-500/70'}>
                          Giá: {item.cost.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>

                    {!item.purchased && (
                      <button
                        onClick={() => handlePurchase(item.id, item.cost, isLocked)}
                        disabled={isLocked || !canAfford}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isLocked
                            ? 'bg-slate-900 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 shadow-md font-extrabold hover:scale-105 cursor-pointer'
                            : 'bg-amber-900/40 text-amber-600/70 border border-amber-800/40 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        <span>
                          {isLocked
                            ? 'Chưa mở khóa'
                            : canAfford
                            ? 'Mua Ngay'
                            : 'Chưa đủ tiền'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-amber-800 flex items-center justify-between">
          <div className="text-xs text-amber-300/80 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Nấu phở càng ngon, phục vụ càng nhanh để nhận tiền boa khủng mua đồ!</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-200 text-xs font-bold transition-all"
          >
            Đóng bảng mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};
