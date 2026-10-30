import React, { useState } from 'react';
import {
  BowlSize,
  NoodleType,
  BrothType,
  MeatType,
  HerbGarnish,
  PreparedBowl,
  Customer,
} from '../types/game';
import { INGREDIENT_NAMES } from '../utils/customerGenerator';
import { sound } from '../services/sound';
import { Utensils, RotateCcw, CheckCircle, Flame, Sparkles } from 'lucide-react';

interface CookingStationProps {
  customers: Customer[];
  activeTableIdx: number | null;
  onSelectTable: (idx: number) => void;
  onServeBowl: (bowl: PreparedBowl, targetCustomer: Customer) => void;
  brothBoilSpeedMultiplier?: number;
}

export const CookingStation: React.FC<CookingStationProps> = ({
  customers,
  activeTableIdx,
  onSelectTable,
  onServeBowl,
}) => {
  const [bowl, setBowl] = useState<PreparedBowl>({
    bowlSize: 'standard',
    meats: [],
    herbs: [],
  });
  const [isPouringBroth, setIsPouringBroth] = useState(false);
  const [isDippingNoodles, setIsDippingNoodles] = useState(false);

  // Active target customer
  const targetCustomer =
    customers.find((c) => c.tableIndex === activeTableIdx && c.state === 'WAITING') ||
    customers.find((c) => c.state === 'WAITING');

  const handleSelectBowlSize = (size: BowlSize) => {
    sound.playClick();
    setBowl((prev) => ({ ...prev, bowlSize: size }));
  };

  const handleDipNoodles = (type: NoodleType) => {
    sound.playDipNoodles();
    setIsDippingNoodles(true);
    setTimeout(() => setIsDippingNoodles(false), 350);
    setBowl((prev) => ({ ...prev, noodles: type }));
  };

  const handleToggleMeat = (meat: MeatType) => {
    sound.playChopMeat();
    setBowl((prev) => {
      const exists = prev.meats.includes(meat);
      return {
        ...prev,
        meats: exists ? prev.meats.filter((m) => m !== meat) : [...prev.meats, meat],
      };
    });
  };

  const handlePourBroth = (type: BrothType) => {
    sound.playBrothPour();
    setIsPouringBroth(true);
    setTimeout(() => setIsPouringBroth(false), 450);
    setBowl((prev) => ({ ...prev, broth: type }));
  };

  const handleToggleHerb = (herb: HerbGarnish) => {
    sound.playSprinkleHerbs();
    setBowl((prev) => {
      const exists = prev.herbs.includes(herb);
      return {
        ...prev,
        herbs: exists ? prev.herbs.filter((h) => h !== herb) : [...prev.herbs, herb],
      };
    });
  };

  const handleResetBowl = () => {
    sound.playClick();
    setBowl({
      bowlSize: 'standard',
      meats: [],
      herbs: [],
    });
  };

  const handleServe = () => {
    if (!targetCustomer) return;
    onServeBowl(bowl, targetCustomer);
    handleResetBowl();
  };

  const isBowlEmpty = !bowl.noodles && !bowl.broth && bowl.meats.length === 0 && bowl.herbs.length === 0;
  const canServe = Boolean(targetCustomer && bowl.broth && bowl.noodles);

  return (
    <div className="bg-amber-900/90 border-2 border-amber-700/80 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-md text-amber-50">
      {/* 1. Header: Kitchen Title & Target Customer Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-700/60">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-800 rounded-xl border border-amber-600/40 text-amber-200 shadow">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-100 flex items-center gap-2">
              Quầy Chế Biến Phở Truyền Thống
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-800 text-amber-300 font-normal">
                Bếp luôn sôi 100°C
              </span>
            </h2>
            <p className="text-xs text-amber-300/80 hidden sm:block">
              Làm đúng từng chi tiết theo yêu cầu của từng vị khách để nhận tối đa tiền boa!
            </p>
          </div>
        </div>

        {/* Target Table Selector */}
        <div className="flex items-center gap-1.5 bg-amber-950/80 p-1.5 rounded-xl border border-amber-800/80 overflow-x-auto max-w-full">
          <span className="text-xs font-semibold text-amber-300 px-1.5 whitespace-nowrap">Đang nấu:</span>
          {customers.map((c) => {
            const isSelected = targetCustomer?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectTable(c.tableIndex)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 shadow scale-105 ring-2 ring-amber-300'
                    : 'bg-amber-900/70 text-amber-200 hover:bg-amber-800 border border-amber-700/50'
                }`}
              >
                <span>Bàn {c.tableIndex + 1}</span>
                <span className="truncate max-w-[85px]">({c.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MOBILE & IPAD COMPACT QUICK-ACTION STRIP (Shown on < lg screens so mobile/iPad never need to scroll down) */}
      <div className="lg:hidden my-2.5 p-2.5 rounded-xl bg-amber-950/90 border border-amber-600/70 shadow-inner flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            {bowl.broth && (
              <div className="absolute -top-2.5 inset-x-0 flex justify-center text-xs animate-bounce opacity-80 pointer-events-none">
                <span>♨️</span>
              </div>
            )}
            <div
              className={`w-full h-full rounded-full border-2 shadow-lg flex items-center justify-center bg-slate-100 ${
                bowl.bowlSize === 'xe_lua'
                  ? 'border-amber-400'
                  : bowl.bowlSize === 'to_lon'
                  ? 'border-blue-400'
                  : 'border-emerald-400'
              }`}
            >
              <div
                className={`w-[85%] h-[85%] rounded-full shadow-inner flex flex-col items-center justify-center overflow-hidden relative text-center ${
                  !bowl.broth
                    ? 'bg-amber-100/50'
                    : bowl.broth === 'nuoc_thanh_bo'
                    ? 'bg-amber-700'
                    : bowl.broth === 'nuoc_beo_dam'
                    ? 'bg-amber-800'
                    : 'bg-red-700'
                }`}
              >
                {bowl.noodles && <span className="text-[10px] text-white font-bold">🍜 Bánh</span>}
                {bowl.meats.length > 0 && (
                  <span className="text-[8px] text-red-100 font-semibold bg-red-950/80 px-1 rounded">
                    🥩 {bowl.meats.length}
                  </span>
                )}
                {isBowlEmpty && <span className="text-[9px] text-amber-900/70 font-semibold">Tô trống</span>}
              </div>
            </div>
          </div>

          <div className="text-xs space-y-0.5">
            <div className="font-bold text-amber-200 flex items-center gap-1">
              <span>{INGREDIENT_NAMES[bowl.bowlSize]}</span>
              {!isBowlEmpty && (
                <button
                  onClick={handleResetBowl}
                  className="text-[10px] text-rose-300 hover:text-rose-100 ml-1 underline flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Đổ lại
                </button>
              )}
            </div>
            <p className="text-[11px] text-amber-100">
              {bowl.noodles ? (
                <span className="text-emerald-300 font-semibold">✓ {INGREDIENT_NAMES[bowl.noodles]}</span>
              ) : (
                <span className="text-amber-400 italic">• Chưa bánh</span>
              )}{' '}
              ·{' '}
              {bowl.broth ? (
                <span className="text-emerald-300 font-semibold">✓ {INGREDIENT_NAMES[bowl.broth]}</span>
              ) : (
                <span className="text-amber-400 italic">• Chưa nước lèo</span>
              )}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={handleServe}
            disabled={!canServe}
            className={`w-full sm:w-auto py-2 px-4 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 border ${
              canServe
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-300 scale-102 animate-pulse cursor-pointer'
                : 'bg-amber-950/80 text-amber-600 border-amber-800/80 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>
              {canServe
                ? `BƯNG RA BÀN ${targetCustomer ? targetCustomer.tableIndex + 1 : '—'} NGAY`
                : 'Cần bánh & nước lèo'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. MAIN KITCHEN LAYOUT: Split 2-Column on Desktop (PC) & Fluid on Mobile/Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
        {/* Left Column: Ingredients Preparation Palettes */}
        <div className="lg:col-span-8 space-y-3">
          {/* Step 1 & 2: Chọn Cỡ Tô & Trụng Bánh Phở */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Cỡ Tô */}
            <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800/60 shadow">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center justify-between">
                <span>1. Chọn cỡ tô phở</span>
                <span className="text-[11px] text-amber-400 font-normal">
                  Đang chọn: {INGREDIENT_NAMES[bowl.bowlSize]}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['standard', 'to_lon', 'xe_lua'] as BowlSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSelectBowlSize(size)}
                    className={`py-2 px-1 text-xs rounded-lg border text-center transition-all ${
                      bowl.bowlSize === size
                        ? 'bg-amber-400 text-amber-950 border-amber-200 font-black shadow ring-1 ring-amber-300'
                        : 'bg-amber-900/60 border-amber-700/50 text-amber-200 hover:bg-amber-800'
                    }`}
                  >
                    <div className="text-sm">🥣</div>
                    <div className="font-semibold mt-0.5">{INGREDIENT_NAMES[size]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Trụng Bánh Phở */}
            <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800/60 shadow">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center justify-between">
                <span>2. Trụng bánh phở nóng</span>
                {bowl.noodles && (
                  <span className="text-[11px] text-emerald-400 font-bold">✓ Đã có bánh phở</span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['banh_pho_mem', 'pho_tai_lan', 'pho_soi_to'] as NoodleType[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => handleDipNoodles(n)}
                    className={`py-2 px-1 text-xs rounded-lg border text-center transition-all ${
                      bowl.noodles === n
                        ? 'bg-amber-400 text-amber-950 border-amber-200 font-black shadow ring-1 ring-amber-300'
                        : 'bg-amber-900/60 border-amber-700/50 text-amber-200 hover:bg-amber-800'
                    }`}
                  >
                    <div className="text-sm">🍜</div>
                    <div className="font-semibold text-[11px] mt-0.5 leading-tight">
                      {n === 'banh_pho_mem' ? 'Phở Mềm' : n === 'pho_tai_lan' ? 'Phở Trụng Kỹ' : 'Phở Sợi To'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Chọn Các Loại Thịt */}
          <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800/60 shadow">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300">
                3. Gắp thịt tươi ngon ({bowl.meats.length} loại đã chọn)
              </label>
              <span className="text-[11px] text-amber-400">Click để chọn hoặc bỏ chọn</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['bo_tai', 'bo_nam_chin', 'gau_bo', 'bo_vien', 'trung_chan', 'suon_bo'] as MeatType[]).map((meat) => {
                const isSelected = bowl.meats.includes(meat);
                return (
                  <button
                    key={meat}
                    onClick={() => handleToggleMeat(meat)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-red-800 text-white border-red-300 shadow-md scale-105 font-bold ring-2 ring-red-400'
                        : 'bg-amber-900/50 border-amber-700/50 text-amber-200 hover:bg-amber-800/80'
                    }`}
                  >
                    <div className="text-xl">
                      {meat === 'bo_tai' ? '🥩' : meat === 'bo_nam_chin' ? '🥓' : meat === 'gau_bo' ? '🧈' : meat === 'bo_vien' ? '🧆' : meat === 'trung_chan' ? '🥚' : '🍖'}
                    </div>
                    <div className="text-[11px] mt-1 font-semibold leading-tight">
                      {meat === 'bo_tai' ? 'Bò Tái' : meat === 'bo_nam_chin' ? 'Bò Nạm' : meat === 'gau_bo' ? 'Gầu Giòn' : meat === 'bo_vien' ? 'Bò Viên' : meat === 'trung_chan' ? 'Trứng Chần' : 'Sườn Bò'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Chan Nước Dùng Nóng Hổi */}
          <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800/60 shadow">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                4. Chan nồi nước dùng nóng hổi
              </label>
              {bowl.broth && (
                <span className="text-[11px] text-amber-300 font-bold">
                  ✓ {INGREDIENT_NAMES[bowl.broth]}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['nuoc_thanh_bo', 'nuoc_beo_dam', 'nuoc_sa_te_cay'] as BrothType[]).map((brothType) => {
                const isSelected = bowl.broth === brothType;
                return (
                  <button
                    key={brothType}
                    onClick={() => handlePourBroth(brothType)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border-amber-200 shadow-md font-black ring-2 ring-amber-300'
                        : 'bg-amber-900/50 border-amber-700/50 text-amber-200 hover:bg-amber-800/80'
                    }`}
                  >
                    <span className="text-xl">
                      {brothType === 'nuoc_thanh_bo' ? '🍲' : brothType === 'nuoc_beo_dam' ? '🥣' : '🌶️'}
                    </span>
                    <span className="text-xs font-bold mt-1">
                      {brothType === 'nuoc_thanh_bo' ? 'Nước Thanh' : brothType === 'nuoc_beo_dam' ? 'Nước Béo' : 'Sa Tế Cay'}
                    </span>
                    <span className="text-[10px] text-amber-300/80">Múc chan vào tô</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Rau Thơm, Gia Vị & Quẩy */}
          <div className="bg-amber-950/70 p-3 rounded-xl border border-amber-800/60 shadow">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300">
                5. Rau thơm & gia vị ({bowl.herbs.length} món)
              </label>
              <span className="text-[11px] text-amber-400">Click chọn gia vị yêu cầu</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {(['hanh_la', 'ngo_gai', 'gia_do', 'ot_tuoi', 'chanh_tuoi', 'tuong_den_do', 'quay_gion'] as HerbGarnish[]).map((herb) => {
                const isSelected = bowl.herbs.includes(herb);
                return (
                  <button
                    key={herb}
                    onClick={() => handleToggleHerb(herb)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100 border-emerald-300 shadow font-bold scale-105 ring-2 ring-emerald-400'
                        : 'bg-amber-900/40 border-amber-700/50 text-amber-200 hover:bg-amber-800'
                    }`}
                  >
                    <div className="text-base">
                      {herb === 'hanh_la' ? '🌱' : herb === 'ngo_gai' ? '🌿' : herb === 'gia_do' ? '🥢' : herb === 'ot_tuoi' ? '🌶️' : herb === 'chanh_tuoi' ? '🍋' : herb === 'tuong_den_do' ? '🫙' : '🥖'}
                    </div>
                    <div className="text-[10px] mt-0.5 font-medium leading-tight">
                      {herb === 'hanh_la' ? 'Hành lá' : herb === 'ngo_gai' ? 'Ngò gai' : herb === 'gia_do' ? 'Giá đỗ' : herb === 'ot_tuoi' ? 'Ớt tươi' : herb === 'chanh_tuoi' ? 'Chanh' : herb === 'tuong_den_do' ? 'Tương' : 'Quẩy giòn'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (PC & LARGE SCREENS ONLY - "Phiền phức & Đầy đủ chi tiết như hồi nãy cho PC") */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between bg-amber-950/80 p-4 rounded-2xl border border-amber-700/60 shadow-inner">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-800/80 mb-3">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tô Phở Đang Nấu
              </span>
              <button
                onClick={handleResetBowl}
                disabled={isBowlEmpty}
                className="text-xs text-rose-300 hover:text-rose-100 disabled:opacity-30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Đổ làm lại
              </button>
            </div>

            {/* Bowl Graphic with Steam and Layering */}
            <div className="relative w-full aspect-square max-w-[210px] mx-auto my-2 flex items-center justify-center">
              {bowl.broth && (
                <div className="absolute -top-6 inset-x-0 flex justify-center gap-3 pointer-events-none opacity-80 animate-pulse">
                  <span className="text-2xl animate-bounce">♨️</span>
                  <span className="text-xl animate-bounce delay-100">♨️</span>
                </div>
              )}

              {/* Ceramic Bowl */}
              <div
                className={`relative rounded-full border-4 shadow-2xl flex items-center justify-center transition-transform ${
                  bowl.bowlSize === 'xe_lua'
                    ? 'w-48 h-48 border-amber-400'
                    : bowl.bowlSize === 'to_lon'
                    ? 'w-44 h-44 border-blue-400'
                    : 'w-40 h-40 border-emerald-400'
                } ${isPouringBroth || isDippingNoodles ? 'scale-105' : 'scale-100'} bg-gradient-to-b from-slate-100 to-slate-200`}
              >
                <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-blue-600/40 pointer-events-none" />

                {/* Soup broth layer */}
                <div
                  className={`w-[88%] h-[88%] rounded-full shadow-inner flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 relative ${
                    !bowl.broth
                      ? 'bg-amber-100/40'
                      : bowl.broth === 'nuoc_thanh_bo'
                      ? 'bg-amber-700/85'
                      : bowl.broth === 'nuoc_beo_dam'
                      ? 'bg-amber-800/90'
                      : 'bg-red-700/85'
                  }`}
                >
                  {bowl.noodles && (
                    <div className="absolute inset-2 flex items-center justify-center">
                      <div className="w-full h-full rounded-full border-2 border-white/70 border-dashed animate-spin duration-1000 opacity-75" />
                      <div className="absolute text-xs text-white/90 font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {INGREDIENT_NAMES[bowl.noodles]}
                      </div>
                    </div>
                  )}

                  {bowl.meats.length > 0 && (
                    <div className="absolute inset-3 flex flex-wrap items-center justify-center gap-1 p-2">
                      {bowl.meats.map((m) => (
                        <span
                          key={m}
                          className="text-xs px-1.5 py-0.5 bg-red-950/80 text-red-100 rounded-md font-medium border border-red-500/50 shadow"
                        >
                          {m === 'bo_tai' ? '🥩 Tái' : m === 'bo_nam_chin' ? '🥓 Nạm' : m === 'gau_bo' ? '🧈 Gầu' : m === 'bo_vien' ? '🧆 Viên' : m === 'trung_chan' ? '🥚 Trứng' : '🍖 Sườn'}
                        </span>
                      ))}
                    </div>
                  )}

                  {bowl.herbs.length > 0 && (
                    <div className="absolute bottom-2 flex flex-wrap justify-center gap-1 max-w-[85%]">
                      {bowl.herbs.map((h) => (
                        <span
                          key={h}
                          className="text-[10px] px-1 py-0.2 bg-emerald-950/80 text-emerald-200 rounded font-semibold border border-emerald-500/40"
                        >
                          {h === 'hanh_la' ? '🌱' : h === 'ngo_gai' ? '🌿' : h === 'gia_do' ? 'Giá' : h === 'ot_tuoi' ? '🌶️' : h === 'chanh_tuoi' ? '🍋' : h === 'tuong_den_do' ? 'Tương' : 'Quẩy'}
                        </span>
                      ))}
                    </div>
                  )}

                  {isBowlEmpty && (
                    <div className="text-center p-3 text-amber-900/60 font-medium text-xs">
                      Tô trống<br />Hãy chọn cỡ tô & trụng bánh phở!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Target Order Requirements Comparison Checklist */}
            {targetCustomer && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-900/60 border border-amber-700/60 text-xs space-y-1.5">
                <div className="font-bold text-amber-200 flex items-center justify-between border-b border-amber-800 pb-1">
                  <span>Yêu cầu của {targetCustomer.name}:</span>
                  <span className="text-amber-400 font-mono">+{targetCustomer.price.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <span>• Cỡ:</span>
                  <span className={bowl.bowlSize === targetCustomer.order.bowlSize ? 'text-emerald-400 font-bold' : 'text-amber-100'}>
                    {INGREDIENT_NAMES[targetCustomer.order.bowlSize]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <span>• Bánh:</span>
                  <span className={bowl.noodles === targetCustomer.order.noodles ? 'text-emerald-400 font-bold' : 'text-amber-100'}>
                    {INGREDIENT_NAMES[targetCustomer.order.noodles]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <span>• Nước dùng:</span>
                  <span className={bowl.broth === targetCustomer.order.broth ? 'text-emerald-400 font-bold' : 'text-amber-100'}>
                    {INGREDIENT_NAMES[targetCustomer.order.broth]}
                  </span>
                </div>
                <div className="text-amber-300">
                  <span>• Thịt ({targetCustomer.order.meats.length}): </span>
                  <span className="text-amber-100 font-medium">
                    {targetCustomer.order.meats.map((m) => INGREDIENT_NAMES[m]).join(', ')}
                  </span>
                </div>
                <div className="text-amber-300">
                  <span>• Rau & Gia vị: </span>
                  <span className="text-amber-100 font-medium">
                    {targetCustomer.order.herbs.map((h) => INGREDIENT_NAMES[h]).join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Serve Food Button on Desktop PC */}
          <div className="mt-4 pt-3 border-t border-amber-800">
            <button
              onClick={handleServe}
              disabled={!canServe}
              className={`w-full py-3 px-4 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border tracking-wide cursor-pointer ${
                canServe
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border-emerald-300 shadow-xl scale-102 hover:scale-105 animate-pulse'
                  : 'bg-amber-950/80 text-amber-600 border-amber-800/80 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>BƯNG PHỞ RA BÀN {targetCustomer ? targetCustomer.tableIndex + 1 : '—'}</span>
            </button>
            {!canServe && !isBowlEmpty && (
              <p className="text-[11px] text-amber-400/90 text-center mt-1.5">
                * Chưa xong: Cần trụng bánh phở và chan nước dùng nóng!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
