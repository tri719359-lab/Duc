import React from 'react';
import { Customer, FaceMood } from '../types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { INGREDIENT_NAMES } from '../utils/customerGenerator';
import { Clock, Coffee, AlertTriangle, Sparkles, PauseCircle, Flame } from 'lucide-react';
import { sound } from '../services/sound';

interface CustomerTableProps {
  customer: Customer | null;
  tableIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onGiveTea?: (customerId: string) => void;
  hasTeaUpgrade?: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customer,
  tableIndex,
  isSelected,
  onSelect,
  onGiveTea,
  hasTeaUpgrade = true,
}) => {
  // If table is empty
  if (!customer) {
    return (
      <div
        id={`customer-table-${tableIndex}`}
        onClick={onSelect}
        className={`h-full min-h-[140px] sm:min-h-[160px] rounded-2xl border-2 border-dashed border-amber-800/50 bg-amber-950/30 flex flex-col items-center justify-center p-3 transition-all text-amber-600/70 cursor-pointer ${
          isSelected ? 'border-amber-400 bg-amber-900/30 ring-1 ring-amber-400/40' : 'hover:border-amber-700'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-800/40 flex items-center justify-center text-xl mb-1">
          🪑
        </div>
        <div className="text-xs font-bold text-amber-400">Bàn Số {tableIndex + 1}</div>
        <div className="text-[10px] text-amber-600">Đang trống · Khách sắp vào...</div>
      </div>
    );
  }

  const isTimerActive = customer.isTimerActive !== false;

  // Calculate patience percentage and time format
  const patiencePercent = isTimerActive
    ? Math.max(0, Math.min(100, (customer.remainingTime / customer.maxWaitTime) * 100))
    : 100;
  const minutes = Math.floor(customer.remainingTime / 60);
  const seconds = Math.floor(customer.remainingTime % 60);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Determine mood based on state & patience
  let mood: FaceMood = 'PATIENT';
  if (customer.state === 'SLAPPED_TABLE_LEFT') {
    mood = 'SLAMMING';
  } else if (customer.state === 'EATING' || customer.state === 'FINISHED_HAPPY') {
    mood = 'EATING';
  } else if (!isTimerActive) {
    mood = 'PATIENT'; // relaxed while waiting for their turn
  } else if (patiencePercent < 25) {
    mood = 'ANGRY';
  } else if (patiencePercent < 50) {
    mood = 'WORRIED';
  } else {
    mood = 'PATIENT';
  }

  const isCriticalPatience = isTimerActive && patiencePercent < 25;
  const isSlamming = customer.state === 'SLAPPED_TABLE_LEFT';

  const handleGiveTea = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!customer.hasReceivedTea && onGiveTea && customer.state === 'WAITING') {
      sound.playPourTea();
      onGiveTea(customer.id);
    }
  };

  return (
    <div
      id={`customer-table-${tableIndex}`}
      onClick={onSelect}
      className={`relative rounded-2xl border-2 transition-all p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer overflow-hidden ${
        isSlamming
          ? 'bg-red-950/90 border-red-500 shadow-2xl animate-shake'
          : isSelected
          ? 'bg-amber-900/90 border-amber-400 shadow-xl ring-2 ring-amber-400/50'
          : 'bg-amber-950/80 border-amber-800/70 hover:border-amber-600 shadow-md'
      }`}
    >
      {/* Slamming overlay effect */}
      {isSlamming && (
        <div className="absolute inset-0 bg-red-600/30 pointer-events-none z-10 flex items-center justify-center">
          <div className="bg-red-900 border-2 border-red-300 text-white font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl shadow-2xl rotate-[-3deg] animate-bounce">
            💥 ĐẬP BÀN BỎ ĐI! (HẾT GIỜ CHỜ) 💥
          </div>
        </div>
      )}

      {/* Top row: Table index, visits badge, patience countdown */}
      <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-amber-800/60">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-md bg-amber-800 text-amber-200 text-[11px] font-bold">
            Bàn {tableIndex + 1}
          </span>
          {customer.visitsCount > 1 ? (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 border border-emerald-600/50 flex items-center gap-0.5 font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              Lần {customer.visitsCount}/{customer.maxVisits}
            </span>
          ) : (
            <span className="text-[10px] text-amber-400/80">Lần 1</span>
          )}

          {/* Status badge: Waiting turn vs Active timer */}
          {!isTimerActive ? (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-950 text-sky-300 border border-sky-600/60 flex items-center gap-0.5">
              <PauseCircle className="w-2.5 h-2.5 text-sky-400" />
              Chờ bàn 1 xong
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-600/60 flex items-center gap-0.5 animate-pulse">
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              {customer.maxWaitTime >= 300
                ? 'Cao điểm 5p'
                : customer.maxWaitTime === 180
                ? 'Tiêu chuẩn 3p'
                : 'Nhanh 1p30s'}
            </span>
          )}
        </div>

        {/* Patience Timer */}
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-mono tabular-nums font-bold border ${
            !isTimerActive
              ? 'bg-slate-900 text-sky-300 border-sky-800/80'
              : isCriticalPatience
              ? 'bg-red-900 text-red-100 border-red-400 animate-pulse'
              : 'bg-amber-950 text-amber-300 border-amber-700/60'
          }`}
        >
          {!isTimerActive ? (
            <>
              <PauseCircle className="w-3 h-3 text-sky-400" />
              <span>Chờ lượt</span>
            </>
          ) : (
            <>
              <Clock className={`w-3 h-3 ${isCriticalPatience ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
              <span>{formattedTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Patience Bar */}
      <div className="w-full bg-amber-950 rounded-full h-1.5 my-1.5 overflow-hidden border border-amber-800/80">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            !isTimerActive
              ? 'bg-sky-500'
              : patiencePercent > 50
              ? 'bg-emerald-500'
              : patiencePercent > 25
              ? 'bg-amber-400'
              : 'bg-red-500 animate-pulse'
          }`}
          style={{ width: `${patiencePercent}%` }}
        />
      </div>

      {/* Middle Row: Customer Avatar & Dialogue/Order */}
      <div className="flex items-start gap-2.5 lg:gap-3.5 my-1">
        {/* Customer Avatar */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="hidden lg:block">
            <AvatarDisplay
              config={customer.avatar}
              mood={mood}
              size="md"
              isCustomer={true}
              showTableSlamArms={isSlamming}
            />
          </div>
          <div className="lg:hidden">
            <AvatarDisplay
              config={customer.avatar}
              mood={mood}
              size="sm"
              isCustomer={true}
              showTableSlamArms={isSlamming}
            />
          </div>
          <div className="text-[10px] lg:text-xs font-bold text-amber-200 text-center mt-0.5 truncate max-w-[70px] lg:max-w-[85px]">
            {customer.name}
          </div>
          <div className="hidden lg:block text-[9px] text-amber-400/80 text-center truncate max-w-[85px]">
            {customer.title}
          </div>
        </div>

        {/* Speech Bubble: Phở Order Details */}
        <div className="flex-1 bg-amber-900/50 p-2 lg:p-2.5 rounded-xl border border-amber-700/60 text-xs relative text-amber-100 flex flex-col justify-between min-h-[90px] lg:min-h-[105px]">
          {/* Bubble tail */}
          <div className="absolute top-3 -left-1 w-2.5 h-2.5 bg-amber-900/80 border-l border-b border-amber-700/60 rotate-45" />

          {customer.state === 'SLAPPED_TABLE_LEFT' ? (
            <div className="text-red-300 font-bold space-y-0.5 text-[11px]">
              <p>😡 "ĐẬP BÀN CÁI RẦM!"</p>
              <p className="text-[10px] text-red-200 font-normal">
                {customer.maxWaitTime >= 300
                  ? 'Đợi quá 5 phút cao điểm rồi! Bực mình quá, đập bàn đi tiệm khác ăn!'
                  : customer.maxWaitTime === 180
                  ? 'Đợi quá 3 phút rồi! Quán làm chậm chạp quá, tôi đập bàn bỏ đi!'
                  : 'Đợi quá 1 phút 30 giây rồi! Quán làm chậm chạp quá, tôi đập bàn bỏ đi!'}
              </p>
            </div>
          ) : customer.state === 'EATING' ? (
            <div className="text-emerald-300 space-y-0.5 text-xs">
              <p className="font-bold flex items-center gap-1">
                <span>🍜 Mlem mlem! Ngon quá!</span>
              </p>
              <p className="text-[10px] text-amber-200">
                "Phở chuẩn vị, nước dùng thơm lừng!"
              </p>
            </div>
          ) : (
            <div className="space-y-0.5 text-[11px]">
              <div className="font-bold text-amber-200 flex items-center justify-between border-b border-amber-800/80 pb-0.5">
                <span className="text-amber-300 font-extrabold">{INGREDIENT_NAMES[customer.order.bowlSize]}</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  +{customer.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <p className="text-amber-100 text-[10px]">
                🍜 {INGREDIENT_NAMES[customer.order.noodles]} · 🍲 {INGREDIENT_NAMES[customer.order.broth]}
              </p>
              <p className="text-amber-200 text-[10px] font-medium">
                🥩 {customer.order.meats.map((m) => INGREDIENT_NAMES[m]).join(', ')}
              </p>
              <p className="text-emerald-300 text-[10px]">
                🌿 {customer.order.herbs.map((h) => INGREDIENT_NAMES[h]).join(', ')}
              </p>
              {!isTimerActive && (
                <p className="text-[9px] text-sky-300 italic pt-0.5">
                  "Tôi chưa vội, cứ nấu xong cho vị khách bàn kia rồi tới tôi nhé!"
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Action buttons */}
      <div className="flex items-center justify-between pt-1.5 border-t border-amber-800/60 mt-1">
        {customer.state === 'WAITING' ? (
          <>
            {hasTeaUpgrade ? (
              <button
                onClick={handleGiveTea}
                disabled={customer.hasReceivedTea || !isTimerActive}
                title="Mời khách ly trà đá (+30s)"
                className={`px-2 py-0.5 text-[10px] rounded-lg border flex items-center gap-1 transition-all ${
                  customer.hasReceivedTea || !isTimerActive
                    ? 'bg-amber-950/60 text-amber-600 border-amber-900 cursor-not-allowed opacity-60'
                    : 'bg-teal-800 hover:bg-teal-700 text-teal-100 border-teal-500 font-semibold shadow cursor-pointer'
                }`}
              >
                <Coffee className="w-2.5 h-2.5 text-teal-300" />
                <span>{customer.hasReceivedTea ? 'Đã uống' : '+30s Trà'}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onSelect}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all shadow cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-amber-700 hover:bg-amber-600 text-amber-100'
              }`}
            >
              {isSelected ? '✓ Đang Nấu' : 'Nấu Bàn Này'}
            </button>
          </>
        ) : (
          <div className="text-[10px] text-amber-400 font-mono font-medium">
            {customer.state === 'EATING' ? '🍜 Khách đang ăn...' : 'Đã rời đi'}
          </div>
        )}
      </div>
    </div>
  );
};
