import React from 'react';
import { AvatarConfig } from '../types/game';
import { AvatarDisplay } from './AvatarDisplay';
import { Sparkles, Check, Shuffle, X } from 'lucide-react';
import { sound } from '../services/sound';
import { generateRandomAvatar } from '../utils/customerGenerator';

interface WardrobeModalProps {
  chefAvatar: AvatarConfig;
  onUpdateAvatar: (newConfig: AvatarConfig) => void;
  onClose: () => void;
}

const PRESET_STYLES: { name: string; avatar: AvatarConfig }[] = [
  {
    name: 'Vua Đầu Bếp Phở Hà Nội',
    avatar: {
      skinTone: '#FAD7B0',
      hairStyle: 'chef_toque',
      hairColor: '#1C1917',
      eyes: 'friendly',
      mouth: 'smile',
      outfit: 'chef_uniform',
      outfitColor: '#FFFFFF',
      accessory: 'apron_red',
    },
  },
  {
    name: 'Chủ Quán Nam Bộ Dễ Thương',
    avatar: {
      skinTone: '#E6A87C',
      hairStyle: 'bandana',
      hairColor: '#292524',
      eyes: 'sparkle',
      mouth: 'grin',
      outfit: 'ao_ba_ba',
      outfitColor: '#16A34A',
      accessory: 'tea_towel',
    },
  },
  {
    name: 'Chàng Trai Phố Cổ Bảnh Bao',
    avatar: {
      skinTone: '#FFE5D4',
      hairStyle: 'undercut',
      hairColor: '#451A03',
      eyes: 'cool',
      mouth: 'smile',
      outfit: 'streetwear',
      outfitColor: '#0284C7',
      accessory: 'gold_necklace',
    },
  },
  {
    name: 'Đại Sư Phụ Nước Dùng Rồng Vàng',
    avatar: {
      skinTone: '#F3C498',
      hairStyle: 'curly_bun',
      hairColor: '#1C1917',
      eyes: 'glasses',
      mouth: 'mustache',
      outfit: 'dragon_master',
      outfitColor: '#78350F',
      accessory: 'apron_yellow',
    },
  },
];

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  chefAvatar,
  onUpdateAvatar,
  onClose,
}) => {
  const handleRandomize = () => {
    sound.playClick();
    onUpdateAvatar(generateRandomAvatar());
  };

  const handleApplyPreset = (preset: AvatarConfig) => {
    sound.playClick();
    onUpdateAvatar(preset);
  };

  const updateProp = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    sound.playClick();
    onUpdateAvatar({ ...chefAvatar, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-amber-950 border-2 border-amber-600 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-amber-50 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-amber-900/80 hover:bg-amber-800 text-amber-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-amber-800">
          <div className="p-3 bg-amber-800 rounded-2xl text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-100">
              Tủ Đồ & Diện Mạo Chủ Quán
            </h2>
            <p className="text-xs text-amber-300">
              Mặt quần áo đàng hoàng, phong độ chỉn chu để đón tiếp thực khách!
            </p>
          </div>
        </div>

        {/* Live Preview & Presets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
          {/* Avatar Preview Box */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-amber-900/60 p-5 rounded-2xl border border-amber-700/80 shadow-inner">
            <div className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
              Diện mạo hiện tại
            </div>
            <AvatarDisplay config={chefAvatar} mood="HAPPY" size="xl" />
            <div className="text-sm font-black text-amber-100 mt-3 text-center">
              Chủ Tiệm Phở Bảnh Bao
            </div>
            <button
              onClick={handleRandomize}
              className="mt-3 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-200 border border-amber-600/50 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Ngẫu nhiên diện mạo</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="md:col-span-7 space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Bộ phong cách có sẵn
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_STYLES.map((style) => (
                <button
                  key={style.name}
                  onClick={() => handleApplyPreset(style.avatar)}
                  className="p-2.5 rounded-xl border border-amber-800 bg-amber-900/40 hover:bg-amber-800/80 text-left transition-all flex items-center gap-2.5 group"
                >
                  <AvatarDisplay config={style.avatar} size="sm" mood="HAPPY" />
                  <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 leading-tight">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Customizer Controls */}
        <div className="space-y-4 pt-4 border-t border-amber-800">
          {/* 1. Trang phục (Outfit) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Trang phục mặc trên người:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'chef_uniform', label: 'Áo Bếp Trưởng Trắng' },
                { id: 'ao_ba_ba', label: 'Áo Bà Ba Truyền Thống' },
                { id: 'streetwear', label: 'Áo Phông Năng Động' },
                { id: 'dragon_master', label: 'Áo Rồng Vàng Tinh Hoa' },
                { id: 'vintage_floral', label: 'Áo Hoa Hà Nội Cổ' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProp('outfit', item.id as AvatarConfig['outfit'])}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    chefAvatar.outfit === item.id
                      ? 'bg-amber-500 text-amber-950 border-amber-300 font-bold'
                      : 'bg-amber-900/40 border-amber-800 text-amber-200 hover:bg-amber-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kiểu tóc & Mũ (Hair style & Headgear) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Kiểu tóc & Mũ nón:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'chef_toque', label: 'Mũ Đầu Bếp Cao' },
                { id: 'bandana', label: 'Khăn Buộc Đầu Đỏ' },
                { id: 'traditional_conical', label: 'Nón Lá Việt Nam' },
                { id: 'short_neat', label: 'Tóc Ngắn Chỉn Chu' },
                { id: 'undercut', label: 'Tóc Vuốt Undercut' },
                { id: 'curly_bun', label: 'Búi Tóc Cao' },
                { id: 'ponytail', label: 'Tóc Cột Đuôi Ngựa' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProp('hairStyle', item.id as AvatarConfig['hairStyle'])}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    chefAvatar.hairStyle === item.id
                      ? 'bg-amber-500 text-amber-950 border-amber-300 font-bold'
                      : 'bg-amber-900/40 border-amber-800 text-amber-200 hover:bg-amber-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Phụ kiện (Accessories) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Phụ kiện đi kèm:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'Không có' },
                { id: 'apron_red', label: 'Tạp Dề Đỏ' },
                { id: 'apron_yellow', label: 'Tạp Dề Vàng' },
                { id: 'tea_towel', label: 'Khăn Vắt Vai' },
                { id: 'gold_necklace', label: 'Dây Chuyền Vàng' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProp('accessory', item.id as AvatarConfig['accessory'])}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    chefAvatar.accessory === item.id
                      ? 'bg-amber-500 text-amber-950 border-amber-300 font-bold'
                      : 'bg-amber-900/40 border-amber-800 text-amber-200 hover:bg-amber-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Mắt & Kính (Eyes & Eyewear) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Phụ kiện mắt & Mắt kính:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'glasses', label: '👓 Kính Tròn Trí Thức' },
                { id: 'cool', label: '🕶️ Kính Râm Siêu Ngầu' },
                { id: 'sparkle', label: '✨ Mắt Lấp Lánh Sao' },
                { id: 'focused', label: '🎯 Mắt Sắc Sảo Tập Trung' },
                { id: 'friendly', label: '😊 Mắt Thân Thiện' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProp('eyes', item.id as AvatarConfig['eyes'])}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    chefAvatar.eyes === item.id
                      ? 'bg-amber-500 text-amber-950 border-amber-300 font-bold scale-[1.02] shadow-md'
                      : 'bg-amber-900/40 border-amber-800 text-amber-200 hover:bg-amber-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Nụ cười & Khuôn miệng (Mouth & Expressions) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Nụ cười & Khuôn miệng:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'smile', label: '😊 Nụ Cười Duyên Dáng' },
                { id: 'grin', label: '😁 Cười Tươi Rạng Rỡ' },
                { id: 'mustache', label: '🧔 Ria Mép Lịch Lãm' },
                { id: 'calm', label: '😌 Điềm Đạm Nhã Nhặn' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProp('mouth', item.id as AvatarConfig['mouth'])}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                    chefAvatar.mouth === item.id
                      ? 'bg-amber-500 text-amber-950 border-amber-300 font-bold scale-[1.02] shadow-md'
                      : 'bg-amber-900/40 border-amber-800 text-amber-200 hover:bg-amber-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Done Button */}
        <div className="mt-6 pt-4 border-t border-amber-800 flex justify-end">
          <button
            onClick={() => {
              sound.playUpgradeFanfare();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold shadow-lg transition-all flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Mặc Đồ Xong · Bắt Đầu Nấu Phở!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
