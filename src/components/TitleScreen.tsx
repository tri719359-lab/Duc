import React from 'react';
import { GameMode, AvatarConfig } from '../types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { Play, Sparkles, Shirt, Volume2, VolumeX, Flame } from 'lucide-react';
import { sound } from '../services/sound';

interface TitleScreenProps {
  chefAvatar: AvatarConfig;
  gameMode: GameMode;
  isMuted: boolean;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenWardrobe: () => void;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  chefAvatar,
  gameMode,
  isMuted,
  onSelectMode,
  onStartGame,
  onOpenWardrobe,
  onToggleMute,
}) => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 flex flex-col items-center justify-between p-3 sm:p-6 lg:p-8 text-amber-50 overflow-y-auto">
      {/* Background Decorative Traditional Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Bar with sound toggle and wardrobe link */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 py-1 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-amber-300 uppercase">
            Tiệm Phở Vui Vẻ · Ẩm Thực Việt
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.unlockAudio();
              onToggleMute();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 border border-amber-700/60 text-amber-200 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenWardrobe();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-800/90 hover:bg-amber-700 border border-amber-600/60 text-amber-100 transition-all flex items-center gap-1.5 text-xs font-bold shadow cursor-pointer"
          >
            <Shirt className="w-4 h-4 text-amber-300" />
            <span>Tủ đồ chủ quán</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl lg:max-w-4xl flex flex-col items-center text-center my-auto py-2 z-10 space-y-3 lg:space-y-5">
        {/* Neon Billboard Lockup */}
        <div className="relative inline-block w-full max-w-lg lg:max-w-2xl">
          <div className="absolute -inset-1.5 bg-amber-500/20 blur-xl rounded-3xl" />
          <div className="relative px-4 py-2.5 lg:py-4 rounded-3xl bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-2 border-amber-400/90 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase mb-1">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Gia Truyền Hà Nội - Sài Gòn</span>
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 drop-shadow-[0_4px_14px_rgba(245,158,11,0.5)] tracking-tight my-1">
              TIỆM PHỞ VUI VẺ
            </h1>
            <p className="text-[11px] sm:text-sm text-amber-200 font-medium">
              "Tiêu chuẩn 3 phút · Chơi nhanh 1 phút 30 giây · Nấu nhanh kẻo khách đập bàn bỏ đi!"
            </p>
          </div>
        </div>

        {/* Center Character Showcase */}
        <div className="flex items-center justify-center gap-4 lg:gap-8 py-1">
          <div className="flex flex-col items-center">
            <div className="p-1.5 lg:p-3 rounded-2xl bg-amber-900/60 border border-amber-700/80 shadow-lg">
              <div className="hidden lg:block">
                <AvatarDisplay config={chefAvatar} mood="HAPPY" size="lg" />
              </div>
              <div className="lg:hidden">
                <AvatarDisplay config={chefAvatar} mood="HAPPY" size="md" />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-200 mt-1">
              Chủ Quán Bảnh Bao
            </span>
          </div>

          <div className="text-3xl lg:text-5xl animate-bounce">
            🍜
          </div>

          <div className="flex flex-col items-center">
            <div className="p-1.5 lg:p-3 rounded-2xl bg-amber-900/60 border border-amber-700/80 shadow-lg">
              <div className="hidden lg:block">
                <AvatarDisplay
                  config={{
                    skinTone: '#FAD7B0',
                    hairStyle: 'undercut',
                    hairColor: '#1C1917',
                    eyes: 'friendly',
                    mouth: 'grin',
                    outfit: 'vintage_floral',
                    outfitColor: '#DC2626',
                    accessory: 'gold_necklace',
                  }}
                  mood="HAPPY"
                  size="lg"
                  isCustomer={true}
                />
              </div>
              <div className="lg:hidden">
                <AvatarDisplay
                  config={{
                    skinTone: '#FAD7B0',
                    hairStyle: 'undercut',
                    hairColor: '#1C1917',
                    eyes: 'friendly',
                    mouth: 'grin',
                    outfit: 'vintage_floral',
                    outfitColor: '#DC2626',
                    accessory: 'gold_necklace',
                  }}
                  mood="HAPPY"
                  size="md"
                  isCustomer={true}
                />
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-200 mt-1">
              Khách Quen Vui Vẻ
            </span>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="w-full max-w-xl">
          <div className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chọn Chế Độ Chơi:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left">
            {/* Mode 1: Standard */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectMode('REALISTIC_2MIN');
              }}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                gameMode === 'REALISTIC_2MIN'
                  ? 'bg-amber-900/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-950/50 scale-[1.02]'
                  : 'bg-amber-950/60 border-amber-800/70 hover:border-amber-600 opacity-80'
              }`}
            >
              {gameMode === 'REALISTIC_2MIN' && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] uppercase shadow">
                  Đang chọn
                </span>
              )}
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-200 mb-1">
                <span className="text-base">🥢</span>
                <span>Chế Độ Tiêu Chuẩn (3 phút)</span>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-snug">
                • <strong>20.000đ/tô</strong> · Khách chờ <strong>3 phút</strong> (180s), khách 2 chờ lượt.
                <br />
                • Đủ <strong>8 khách</strong>: 3 khách đếm <strong>5 phút</strong> · Giá tăng lên <strong>30.000đ/tô</strong>!
              </p>
            </button>

            {/* Mode 2: Fast Rush */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectMode('RUSH_60S');
              }}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                gameMode === 'RUSH_60S'
                  ? 'bg-red-950/90 border-red-400 ring-2 ring-red-400/40 shadow-xl shadow-red-950/50 scale-[1.02]'
                  : 'bg-amber-950/60 border-amber-800/70 hover:border-amber-600 opacity-80'
              }`}
            >
              {gameMode === 'RUSH_60S' && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-red-400 text-red-950 font-black text-[9px] uppercase shadow animate-pulse">
                  Đang chọn
                </span>
              )}
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-red-200 mb-1">
                <span className="text-base">⚡</span>
                <span>Chế Độ Nhanh (1 phút 30s)</span>
              </div>
              <p className="text-[11px] text-red-200/90 leading-snug">
                • <strong>30.000đ/tô</strong> · Khách chờ <strong>1 phút 30 giây</strong> (90s).
                <br />
                • <strong>Trên 10 khách:</strong> 3 người cùng tính <strong>3 phút</strong> · Giá tăng lên <strong>35.000đ/tô</strong>!
              </p>
            </button>
          </div>
        </div>

        {/* Detailed Rules Box on Desktop PC */}
        <div className="hidden lg:block bg-amber-950/80 border border-amber-700/70 rounded-2xl p-3.5 max-w-xl text-left shadow-xl w-full">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Chi Tiết Thời Gian Chờ & Giá Bát Phở:
          </h3>
          {gameMode === 'RUSH_60S' ? (
            <ul className="text-xs text-amber-100/90 space-y-1 leading-relaxed">
              <li>
                ⚡ <strong>Chế độ nhanh:</strong> Mỗi khách chỉ chờ <strong>1 phút 30 giây (90s)</strong> — phục vụ nhận <strong>30.000đ / 1 tô</strong>.
              </li>
              <li>
                🔥 <strong>Lúc đông (trên 10 khách):</strong> 3 vị khách <strong>cùng xuất hiện đếm 3 phút</strong> — giá tăng lên <strong>35.000đ / 1 tô</strong>!
              </li>
              <li>
                💰 <strong>Mốc 1 Triệu:</strong> Tự động mở khóa các gói đại gia như <strong>5 Triệu đưa tiệm lên app shipper giao tận nhà</strong> (+150k/chuyến)!
              </li>
            </ul>
          ) : (
            <ul className="text-xs text-amber-100/90 space-y-1 leading-relaxed">
              <li>
                🥢 <strong>Chế độ tiêu chuẩn:</strong> Mỗi khách chờ <strong>3 phút (180s)</strong> — phục vụ nhận <strong>20.000đ / 1 tô</strong>. Khách thứ 2 tạm hoãn chờ tới lượt.
              </li>
              <li>
                🔥 <strong>Lúc đông (đủ 8 khách):</strong> Giờ cao điểm <strong>3 vị khách đếm 5 phút</strong> — giá tăng lên <strong>30.000đ / 1 tô</strong>!
              </li>
              <li>
                💰 <strong>Mốc 1 Triệu:</strong> Tự động mở khóa các gói đại gia như <strong>5 Triệu đưa tiệm lên app shipper giao tận nhà</strong> (+150k/chuyến)!
              </li>
            </ul>
          )}
        </div>

        {/* PRIMARY START BUTTON - Always in View! */}
        <div className="w-full max-w-md lg:max-w-lg pt-1">
          <button
            onClick={() => {
              sound.playUpgradeFanfare();
              onStartGame();
            }}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-base sm:text-lg tracking-wide shadow-2xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2.5 border-2 border-emerald-300 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>
              MỞ CỬA TIỆM ({gameMode === 'RUSH_60S' ? 'CHƠI NHANH 1P30S' : 'TIÊU CHUẨN 3P'})
            </span>
          </button>
        </div>

        {/* Compact Rules Note on Mobile & iPad */}
        <div className="lg:hidden bg-amber-950/70 border border-amber-800/70 rounded-xl p-2.5 text-left text-xs text-amber-200/90 w-full max-w-md space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1 text-[11px] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Đang chọn: {gameMode === 'RUSH_60S' ? 'Chơi Nhanh (1p30s)' : 'Tiêu Chuẩn (3 phút)'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {gameMode === 'RUSH_60S'
              ? '• Khách chờ 1p30s · 30.000đ/tô. Lúc đông (trên 10 khách) 3 người đếm 3p giá 35.000đ/tô! Đạt 1 triệu mở khóa gói 5 triệu shipper!'
              : '• Khách chờ 3 phút · 20.000đ/tô. Lúc đông (đủ 8 khách) 3 người đếm 5p giá 30.000đ/tô! Đạt 1 triệu mở khóa gói 5 triệu shipper!'}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl text-center text-[10px] text-amber-400/60 py-2 border-t border-amber-800/40 z-10">
        Tiệm Phở Vui Vẻ · Tối ưu hoàn hảo cho cả Máy Tính (PC), iPad & Điện Thoại
      </div>
    </div>
  );
};
