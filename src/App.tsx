import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  GameMode,
  Customer,
  PreparedBowl,
  RestaurantStats,
  ShopUpgrade,
  AvatarConfig,
} from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { CookingStation } from './components/CookingStation';
import { CustomerTable } from './components/CustomerTable';
import { WardrobeModal } from './components/WardrobeModal';
import { ShopUpgradesModal } from './components/ShopUpgradesModal';
import { DaySummaryModal } from './components/DaySummaryModal';
import { AvatarDisplay } from './components/AvatarDisplay';
import { createNewCustomer } from './utils/customerGenerator';
import { FloatingMoneyRewardContainer, RewardEvent } from './components/FloatingMoneyReward';
import { sound } from './services/sound';
import confetti from 'canvas-confetti';
import {
  Shirt,
  ShoppingBag,
  Volume2,
  VolumeX,
  Music,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';

const INITIAL_CHEF_AVATAR: AvatarConfig = {
  skinTone: '#FAD7B0',
  hairStyle: 'chef_toque',
  hairColor: '#1C1917',
  eyes: 'friendly',
  mouth: 'smile',
  outfit: 'chef_uniform',
  outfitColor: '#FFFFFF',
  accessory: 'apron_red',
};

// Rich 14-item upgrade catalog across 4 distinct categories
const DEFAULT_UPGRADES: ShopUpgrade[] = [
  // 1. Tables & Decor
  {
    id: 'extra_table_3',
    name: 'Mở Bàn Ăn Số 3',
    desc: 'Kê thêm 1 bàn gỗ khang trang, phục vụ đồng thời 3 nhóm khách!',
    cost: 120000,
    purchased: false,
    icon: '🪑',
    category: 'tables_decor',
    effectType: 'extra_table_3',
  },
  {
    id: 'extra_table_4',
    name: 'Mở Bàn Ăn Số 4 (Khu VIP)',
    desc: 'Mở rộng quán sang căn nhà bên cạnh, phục vụ tối đa 4 bàn cùng lúc!',
    cost: 280000,
    purchased: false,
    icon: '🏮',
    category: 'tables_decor',
    effectType: 'extra_table_4',
  },
  {
    id: 'hoian_lanterns',
    name: 'Đèn Lồng Phố Cổ Hội An',
    desc: 'Không gian ấm cúng lung linh, tăng 60% tỉ lệ khách quen quay lại lần 2-3!',
    cost: 150000,
    purchased: false,
    icon: '🏮',
    category: 'tables_decor',
    effectType: 'hoian_lanterns',
  },
  {
    id: 'massage_chairs',
    name: 'Ghế Bọc Nệm Massage Êm Ái',
    desc: 'Khách ngồi siêu êm mông, giảm cáu gắt và luôn vui tươi!',
    cost: 400000,
    purchased: false,
    icon: '🛋️',
    category: 'tables_decor',
    effectType: 'massage_chairs',
  },
  {
    id: 'music_speaker',
    name: 'Dàn Loa Nhạc Trịnh & Đàn Tranh',
    desc: 'Giai điệu du dương thanh thoát, khách thư giãn và thưởng thêm 10% tiền tip!',
    cost: 250000,
    purchased: false,
    icon: '📻',
    category: 'tables_decor',
    effectType: 'music_speaker',
  },

  // 2. Kitchen & Speed
  {
    id: 'wooden_chopping_board',
    name: 'Thớt Gỗ Nghiến Cổ Thụ',
    desc: 'Thớt gỗ nghiến nghìn năm, dao băm thịt ngọt sớt, thái bò siêu nhanh!',
    cost: 160000,
    purchased: false,
    icon: '🪵',
    category: 'kitchen_speed',
    effectType: 'wooden_chopping_board',
  },
  {
    id: 'crispy_quay_display',
    name: 'Tủ Kính Quẩy Giòn Rụm Hà Nội',
    desc: 'Khách đến tự động gọi thêm quẩy nhúng nước béo (+10.000đ doanh thu)!',
    cost: 190000,
    purchased: false,
    icon: '🥖',
    category: 'kitchen_speed',
    effectType: 'crispy_quay_display',
  },
  {
    id: 'golden_ladle',
    name: 'Vá Múc Phở Bằng Vàng Ròng 24K',
    desc: 'Múc nước lèo phong thủy tài lộc, khách khen nức nở thưởng thêm +20.000đ/tô!',
    cost: 350000,
    purchased: false,
    icon: '🥄',
    category: 'kitchen_speed',
    effectType: 'golden_ladle',
  },

  // 3. Customer Care & Patience Boost
  {
    id: 'free_ice_tea',
    name: 'Bình Trà Đá Hạ Nhiệt',
    desc: 'Mời khách ly trà đá mát lạnh để kéo dài thời gian kiên nhẫn (+30s)!',
    cost: 50000,
    purchased: true,
    icon: '🧊',
    category: 'customer_happiness',
    effectType: 'ice_tea',
  },
  {
    id: 'ginseng_tea',
    name: 'Ấm Trà Sâm Dứa Hạt É Cung Đình',
    desc: 'Nâng cấp trà đá thành trà sâm dứa thơm lừng, kéo dài thêm (+50s) kiên nhẫn!',
    cost: 300000,
    purchased: false,
    icon: '🍵',
    category: 'customer_happiness',
    effectType: 'ginseng_tea',
  },
  {
    id: 'air_conditioner',
    name: 'Máy Lạnh 5HP Siêu Mát Quán',
    desc: 'Không gian mát rượi 22°C, làm chậm 30% tốc độ mất kiên nhẫn của khách!',
    cost: 450000,
    purchased: false,
    icon: '❄️',
    category: 'customer_happiness',
    effectType: 'air_conditioner',
  },

  // 4. Luxury Prestige & Michelin Fame
  {
    id: 'neon_sign',
    name: 'Biển Hiệu Neon Tiệm Phở Vui Vẻ',
    desc: 'Thu hút thêm nhiều khách sành ăn và đại gia ghé lại ăn nhiều lần!',
    cost: 320000,
    purchased: false,
    icon: '✨',
    category: 'luxury_prestige',
    effectType: 'neon_sign',
  },
  {
    id: 'vip_bowls',
    name: 'Bộ Tô Sứ Bát Tràng Men Lam Cổ',
    desc: 'Tô phở gốm Bát Tràng trứ danh, tăng 30.000đ tiền boa trên mỗi tô bán ra!',
    cost: 600000,
    purchased: false,
    icon: '🥣',
    category: 'luxury_prestige',
    effectType: 'vip_bowls',
  },
  {
    id: 'michelin_star',
    name: 'Ngôi Sao Ẩm Thực Michelin Phở Việt',
    desc: 'Được thế giới công nhận là đệ nhất phở, nhân 1.5x toàn bộ doanh thu!',
    cost: 1500000,
    purchased: false,
    icon: '🌟',
    category: 'luxury_prestige',
    requiredUnlockAmount: 1000000,
    effectType: 'michelin_star',
  },

  // 5. Digital Delivery & Millionaire Upgrades (Tự động mở khóa khi đạt mốc 1.000.000đ)
  {
    id: 'auto_noodle_machine',
    name: 'Dây Chuyền Cán Bánh Phở Tươi Tự Động',
    desc: 'Máy tự động cán sợi phở tươi mềm mướt tại chỗ, khách mê tít, tăng +30.000đ/tô!',
    cost: 1200000,
    purchased: false,
    icon: '⚙️',
    category: 'kitchen_speed',
    requiredUnlockAmount: 1000000,
    effectType: 'auto_noodle_machine',
  },
  {
    id: 'electric_broth_vat',
    name: 'Nồi Hầm Xương Bò Điện Khổng Lồ 300L',
    desc: 'Nồi ninh xương tủy công nghiệp 24/7, nước dùng ngọt thanh đậm đà, tăng +40.000đ/tô!',
    cost: 2000000,
    purchased: false,
    icon: '🫕',
    category: 'kitchen_speed',
    requiredUnlockAmount: 1000000,
    effectType: 'electric_broth_vat',
  },
  {
    id: 'drink_station',
    name: 'Quầy Nước Sâm Hạt Chia & Trà Tắc Bán Kèm',
    desc: 'Khách đến ăn phở đều tự động mua thêm nước giải khát, tăng +35.000đ mỗi đơn!',
    cost: 3000000,
    purchased: false,
    icon: '🧋',
    category: 'delivery_online',
    requiredUnlockAmount: 1000000,
    effectType: 'drink_station',
  },
  {
    id: 'online_delivery_shipper',
    name: 'Đưa Tiệm Lên App & Shipper Lấy Đồ Giao Khách',
    desc: 'Đưa quán lên ShopeeFood, Grab, Baemin! Shipper áo cam/xanh liên tục ghé lấy phở giao tận nhà, tự động nhận thêm đơn và thu về +150.000đ mỗi lượt giao!',
    cost: 5000000,
    purchased: false,
    icon: '🛵',
    category: 'delivery_online',
    requiredUnlockAmount: 1000000,
    effectType: 'online_delivery_shipper',
  },
  {
    id: 'international_franchise',
    name: 'Chuỗi Nhượng Quyền Phở Quốc Tế Toàn Cầu',
    desc: 'Mở chi nhánh New York, Tokyo, Paris! Nhân 2.5x toàn bộ doanh thu của tiệm!',
    cost: 10000000,
    purchased: false,
    icon: '🏢',
    category: 'luxury_prestige',
    requiredUnlockAmount: 1000000,
    effectType: 'international_franchise',
  },
];

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [gameMode, setGameMode] = useState<GameMode>('REALISTIC_2MIN');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [showRushHourBanner, setShowRushHourBanner] = useState(false);
  const [show1MillionBanner, setShow1MillionBanner] = useState(false);
  const [shipperToast, setShipperToast] = useState<string | null>(null);

  // Floating money rewards flying to wallet
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [isWalletPulsing, setIsWalletPulsing] = useState(false);

  const handleCoinHitWallet = useCallback(() => {
    setIsWalletPulsing(true);
    sound.playCoinChime();
    setTimeout(() => setIsWalletPulsing(false), 550);
  }, []);

  const handleRewardComplete = useCallback((id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Chef configuration
  const [chefAvatar, setChefAvatar] = useState<AvatarConfig>(INITIAL_CHEF_AVATAR);

  // Upgrades
  const [upgrades, setUpgrades] = useState<ShopUpgrade[]>(DEFAULT_UPGRADES);

  // Modals
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);

  // Restaurant statistics
  const [stats, setStats] = useState<RestaurantStats>({
    money: 100000,
    day: 1,
    reputation: 98,
    customersServed: 0,
    tablesSlammed: 0,
    perfectOrders: 0,
    totalEarnedToday: 0,
    hasReached1Million: false,
    highestMoneyReached: 100000,
    shipperDeliveriesCount: 0,
  });

  // Shift timer (simulated per day shift, e.g. 360 seconds)
  const [shiftTimeRemaining, setShiftTimeRemaining] = useState<number>(360);

  // USER RULES:
  // 1. Chế độ Tiêu Chuẩn (REALISTIC_2MIN):
  //    - Phase 1 (< 8 khách): 2 bàn. Khách 1 chờ 1m30s (90s). Khách 2 chưa tính giờ cho tới khi xong khách 1.
  //    - Phase 2 (>= 8 khách): Giờ cao điểm! 3 bàn đồng loạt đếm ngược 5 phút (300s)!
  // 2. Chế độ Chơi Nhanh (RUSH_60S):
  //    - Phase 1 (<= 10 khách): 2 bàn luân phiên nhanh.
  //    - Phase 2 (> 10 khách): Giai đoạn chơi nhanh bùng nổ! 3 người cùng xuất hiện tính thời gian 3 phút (180s) cùng lúc!
  const isRushHour = gameMode === 'REALISTIC_2MIN'
    ? stats.customersServed >= 8
    : stats.customersServed > 10;
  const hasExtraTable4 = upgrades.find((u) => u.id === 'extra_table_4')?.purchased;
  const maxTables = hasExtraTable4 ? 4 : isRushHour ? 3 : 2;

  const [tables, setTables] = useState<(Customer | null)[]>([null, null]);

  // Selected table index for cooking
  const [activeTableIdx, setActiveTableIdx] = useState<number>(0);

  // Queue of returning customers (customers who visit 2-3 times)
  const returningQueueRef = useRef<{ customer: Customer; returnAtTime: number }[]>([]);

  // Sound & Music toggle
  const handleToggleMute = async () => {
    await sound.unlockAudio();
    const muted = sound.toggleMute();
    setIsMuted(muted);
    setIsBgmActive(!muted);
  };

  const handleToggleBGM = async () => {
    await sound.unlockAudio();
    if (isBgmActive) {
      sound.stopBGM();
      setIsBgmActive(false);
    } else {
      sound.startBGM();
      setIsBgmActive(true);
    }
  };

  // Auto-unlock audio on first user click or tap anywhere
  useEffect(() => {
    const unlockOnFirstClick = () => {
      sound.unlockAudio().then(() => {
        if (!isMuted) {
          setIsBgmActive(true);
        }
      });
    };
    window.addEventListener('pointerdown', unlockOnFirstClick, { once: true });
    window.addEventListener('click', unlockOnFirstClick, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockOnFirstClick);
      window.removeEventListener('click', unlockOnFirstClick);
    };
  }, [isMuted]);

  // Adjust table count when entering rush hour or buying upgrade
  useEffect(() => {
    setTables((prev) => {
      if (prev.length < maxTables) {
        const diff = maxTables - prev.length;
        return [...prev, ...new Array(diff).fill(null)];
      }
      return prev;
    });
  }, [maxTables]);

  // Handle customer spawn logic
  const spawnCustomerAtTable = useCallback(
    (tableIdx: number) => {
      const isRush = gameMode === 'REALISTIC_2MIN'
        ? stats.customersServed >= 8
        : stats.customersServed > 10;

      // In phase 1 (before rush): Check if another customer is already actively counting down:
      let isTimerActive = true;
      if (!isRush) {
        const otherTableActive = tables.some(
          (c, i) => i !== tableIdx && c && c.state === 'WAITING' && c.isTimerActive !== false
        );
        if (otherTableActive) {
          isTimerActive = false; // pause this customer until table 1 is completed!
        }
      }

      const now = Date.now();
      const readyReturnIdx = returningQueueRef.current.findIndex((r) => r.returnAtTime <= now);

      let newCustomer: Customer;
      if (readyReturnIdx !== -1) {
        const returnItem = returningQueueRef.current.splice(readyReturnIdx, 1)[0];
        newCustomer = createNewCustomer(tableIdx, isRush, isTimerActive, gameMode, {
          name: returnItem.customer.name,
          visitsCount: returnItem.customer.visitsCount,
          maxVisits: returnItem.customer.maxVisits,
          avatar: returnItem.customer.avatar,
        });
        newCustomer.dialogue = 'Tôi quay lại đây! Làm cho tôi một tô ngon lành như lúc nãy nhé!';
      } else {
        newCustomer = createNewCustomer(tableIdx, isRush, isTimerActive, gameMode);
      }

      sound.playDoorChime();

      setTables((prev) => {
        const next = [...prev];
        next[tableIdx] = newCustomer;
        return next;
      });
    },
    [stats.customersServed, tables, gameMode]
  );

  // Main real-time game loop: tick down patience and shift timer
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      // 1. Shift timer
      setShiftTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState('DAY_SUMMARY');
          return 360;
        }
        return prev - 1;
      });

      // 2. Patience decay with Air Conditioner modifier
      const isRush = gameMode === 'REALISTIC_2MIN'
        ? stats.customersServed >= 8
        : stats.customersServed > 10;
      const hasAC = upgrades.find((u) => u.id === 'air_conditioner')?.purchased;
      const decayRate = hasAC ? 0.7 : 1.0;

      setTables((prevTables) => {
        return prevTables.map((customer, idx) => {
          if (!customer) {
            // Chance to spawn customer if empty
            if (Math.random() < 0.35) {
              setTimeout(() => spawnCustomerAtTable(idx), 200);
            }
            return null;
          }

          if (customer.state === 'WAITING') {
            // In Phase 1 (before rush): Only decay if customer timer is active!
            const shouldDecay = isRush || customer.isTimerActive !== false;
            if (!shouldDecay) {
              return customer; // Do not decay, stay paused!
            }

            const nextRemaining = customer.remainingTime - decayRate;

            // Timer expired -> table slam!
            if (nextRemaining <= 0) {
              sound.playTableSlam();
              setScreenShake(true);
              setTimeout(() => setScreenShake(false), 500);

              setStats((s) => ({
                ...s,
                tablesSlammed: s.tablesSlammed + 1,
                reputation: Math.max(0, s.reputation - 12),
              }));

              // If not rush hour, activate the other waiting customer!
              if (!isRush) {
                setTimeout(() => {
                  setTables((t) =>
                    t.map((otherC, otherIdx) => {
                      if (
                        otherIdx !== idx &&
                        otherC &&
                        otherC.state === 'WAITING' &&
                        otherC.isTimerActive === false
                      ) {
                        return {
                          ...otherC,
                          isTimerActive: true,
                        };
                      }
                      return otherC;
                    })
                  );
                }, 300);
              }

              // Clear table after 2.5 seconds
              setTimeout(() => {
                setTables((t) => {
                  const copy = [...t];
                  if (copy[idx]?.id === customer.id) {
                    copy[idx] = null;
                  }
                  return copy;
                });
              }, 2500);

              return {
                ...customer,
                remainingTime: 0,
                state: 'SLAPPED_TABLE_LEFT',
              };
            }

            return {
              ...customer,
              remainingTime: nextRemaining,
            };
          }

          return customer;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, upgrades, stats.customersServed, gameMode, spawnCustomerAtTable]);

  // Automated Shipper Delivery Loop when 5M Online Delivery upgrade is purchased
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const hasShipper = upgrades.find((u) => u.id === 'online_delivery_shipper')?.purchased;
    if (!hasShipper) return;

    const shipperInterval = setInterval(() => {
      sound.playCoinChime();
      const deliveryEarnings = 150000;
      setStats((prev) => {
        const nextMoney = prev.money + deliveryEarnings;
        return {
          ...prev,
          money: nextMoney,
          totalEarnedToday: prev.totalEarnedToday + deliveryEarnings,
          shipperDeliveriesCount: (prev.shipperDeliveriesCount || 0) + 1,
          highestMoneyReached: Math.max(prev.highestMoneyReached || 0, nextMoney),
          hasReached1Million: true,
        };
      });

      const shippers = ['ShopeeFood', 'GrabFood', 'Baemin', 'Gojek'];
      const randomShipper = shippers[Math.floor(Math.random() * shippers.length)];
      setShipperToast(
        `🛵 Shipper ${randomShipper} vừa ghé lấy 2 tô Phở Đặc Biệt giao cho khách! (+150.000đ)`
      );
      setTimeout(() => setShipperToast(null), 4500);
    }, 14000);

    return () => clearInterval(shipperInterval);
  }, [gameState, upgrades]);

  // Start new game or day
  const handleStartGame = async () => {
    await sound.unlockAudio();
    setGameState('PLAYING');
    setShiftTimeRemaining(360);

    if (!isMuted) {
      sound.startBGM();
      setIsBgmActive(true);
    }

    // Spawn 2 customers: table 0 is active (1m30s), table 1 is paused waiting for turn!
    setTimeout(() => spawnCustomerAtTable(0), 400);
    setTimeout(() => spawnCustomerAtTable(1), 1600);
  };

  const handleNextDay = () => {
    setStats((prev) => ({
      ...prev,
      day: prev.day + 1,
      totalEarnedToday: 0,
    }));
    setShiftTimeRemaining(360);
    setTables(new Array(maxTables).fill(null));
    setGameState('PLAYING');
    setTimeout(() => spawnCustomerAtTable(0), 400);
    setTimeout(() => spawnCustomerAtTable(1), 1600);
  };

  // Give customer tea to extend patience (+30s or +50s with ginseng tea!)
  const handleGiveTea = (customerId: string) => {
    const hasGinseng = upgrades.find((u) => u.id === 'ginseng_tea')?.purchased;
    const bonusTime = hasGinseng ? 50 : 30;

    setTables((prev) =>
      prev.map((c) => {
        if (c && c.id === customerId && !c.hasReceivedTea) {
          return {
            ...c,
            hasReceivedTea: true,
            remainingTime: Math.min(c.maxWaitTime + 30, c.remainingTime + bonusTime),
          };
        }
        return c;
      })
    );
  };

  // Serve Bowl to Customer & Compare Recipe Accuracy
  const handleServeBowl = (preparedBowl: PreparedBowl, targetCustomer: Customer) => {
    const order = targetCustomer.order;

    // Check match
    const sizeMatch = preparedBowl.bowlSize === order.bowlSize;
    const noodleMatch = preparedBowl.noodles === order.noodles;
    const brothMatch = preparedBowl.broth === order.broth;

    // Meat matching
    const missingMeats = order.meats.filter((m) => !preparedBowl.meats.includes(m));
    const extraMeats = preparedBowl.meats.filter((m) => !order.meats.includes(m));
    const meatPerfect = missingMeats.length === 0 && extraMeats.length === 0;

    // Herb matching
    const missingHerbs = order.herbs.filter((h) => !preparedBowl.herbs.includes(h));
    const extraHerbs = preparedBowl.herbs.filter((h) => !order.herbs.includes(h));
    const herbPerfect = missingHerbs.length === 0 && extraHerbs.length === 0;

    const is100Percent = sizeMatch && noodleMatch && brothMatch && meatPerfect && herbPerfect;

    const isCurrentlyRushHour = gameMode === 'REALISTIC_2MIN'
      ? stats.customersServed >= 8
      : stats.customersServed > 10;

    // USER RULE:
    // "bây giờ 1 bát phở bình thường phục vụ bên tiêu chuẩn chỉ đc 20 nghìn đồng thôi
    // còn bên chế độ nhanh thì sẽ đc 30 nghìn
    // còn đến lúc đông bên tiêu chuẩn sẽ được 30 nghìn 1 tô
    // còn bên chơi nhanh 35 nghìn đồng 1 tô"
    const baseBowlPrice = gameMode === 'REALISTIC_2MIN'
      ? (isCurrentlyRushHour ? 30000 : 20000)
      : (isCurrentlyRushHour ? 35000 : 30000);

    let earnAmount = baseBowlPrice;

    // Apply upgrade bonuses if purchased:
    if (upgrades.find((u) => u.id === 'vip_bowls')?.purchased) earnAmount += 30000;
    if (upgrades.find((u) => u.id === 'golden_ladle')?.purchased) earnAmount += 20000;
    if (upgrades.find((u) => u.id === 'crispy_quay_display')?.purchased) earnAmount += 10000;
    if (upgrades.find((u) => u.id === 'auto_noodle_machine')?.purchased) earnAmount += 30000;
    if (upgrades.find((u) => u.id === 'electric_broth_vat')?.purchased) earnAmount += 40000;
    if (upgrades.find((u) => u.id === 'drink_station')?.purchased) earnAmount += 35000;
    if (upgrades.find((u) => u.id === 'online_delivery_shipper')?.purchased) earnAmount += 60000;
    if (upgrades.find((u) => u.id === 'music_speaker')?.purchased)
      earnAmount += Math.round(earnAmount * 0.1);
    if (upgrades.find((u) => u.id === 'michelin_star')?.purchased)
      earnAmount = Math.round(earnAmount * 1.5);
    if (upgrades.find((u) => u.id === 'international_franchise')?.purchased)
      earnAmount = Math.round(earnAmount * 2.5);

    if (is100Percent) {
      earnAmount += 2000; // Tiền boa 2.000đ khi phở chuẩn 100% đúng vị yêu cầu!
      sound.playHappySlurp();
      sound.playCoinChime();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
        });
      } catch {}
    } else {
      sound.playHappySlurp();
      sound.playCoinChime();
    }

    // USER REQUIREMENT:
    // "Thêm hiệu ứng hạt tiền (coin particles) bay lên từ bàn khách mỗi khi khách thanh toán xong"
    // "Thêm một thành phần UI mới hiển thị thông báo số tiền nhận được bay từ vị trí khách hàng lên tổng số tiền hiện tại"
    if (typeof window !== 'undefined') {
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight * 0.45;
      const tableEl = document.getElementById(`customer-table-${targetCustomer.tableIndex}`);
      if (tableEl) {
        const rect = tableEl.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height * 0.42;
      }

      let endX = window.innerWidth * 0.75;
      let endY = 28;
      const walletEl = document.getElementById('wallet-money-counter');
      if (walletEl) {
        const rect = walletEl.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      }

      const rewardId = `rew_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setRewards((prev) => [
        ...prev,
        {
          id: rewardId,
          amount: earnAmount,
          startX,
          startY,
          endX,
          endY,
          isPerfect: is100Percent,
          createdAt: Date.now(),
        },
      ]);
    }

    // Set customer state to EATING
    setTables((prev) =>
      prev.map((c) => {
        if (c?.id === targetCustomer.id) {
          return {
            ...c,
            state: 'EATING',
          };
        }
        return c;
      })
    );

    const nextServed = stats.customersServed + 1;
    const isRushNow = gameMode === 'REALISTIC_2MIN' ? nextServed >= 8 : nextServed > 10;

    // USER RULES:
    // If not rush hour yet: Immediately activate the other waiting customer!
    if (!isRushNow) {
      setTables((prev) =>
        prev.map((c) => {
          if (c && c.id !== targetCustomer.id && c.state === 'WAITING' && c.isTimerActive === false) {
            return {
              ...c,
              isTimerActive: true,
            };
          }
          return c;
        })
      );
    } else {
      // In rush hour, all waiting customers count down simultaneously!
      setTables((prev) =>
        prev.map((c) => {
          if (c && c.state === 'WAITING') {
            return {
              ...c,
              isTimerActive: true,
            };
          }
          return c;
        })
      );
    }

    // USER RULES:
    // - Chế độ Tiêu Chuẩn: Khi phục vụ đủ 8 khách -> 3 khách đếm 5 phút cùng lúc! Giá 1 bát tăng lên 30.000đ!
    // - Chế độ Chơi Nhanh: Khi phục vụ trên 10 khách (> 10, tức lần thứ 11) -> 3 khách đếm 3 phút cùng lúc! Giá 1 bát tăng lên 35.000đ!
    const isRushTrigger = gameMode === 'REALISTIC_2MIN' ? nextServed === 8 : nextServed === 11;
    if (isRushTrigger) {
      setShowRushHourBanner(true);
      sound.playUpgradeFanfare();
      try {
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.5 },
        });
      } catch {}
      setTimeout(() => setShowRushHourBanner(false), 7000);

      // Cập nhật giá các bàn đang ngồi lên giá cao điểm (30.000đ bên Tiêu Chuẩn / 35.000đ bên Chơi Nhanh)
      const rushPrice = gameMode === 'REALISTIC_2MIN' ? 30000 : 35000;
      setTables((prev) =>
        prev.map((c) => (c ? { ...c, price: rushPrice } : null))
      );

      // Spawn 3rd table customer
      setTimeout(() => spawnCustomerAtTable(2), 1500);
    }

    // USER RULE: "khi đạt đến 1 triệu tự mở khóa nhiều cái mới để mua như 5 triệu để đưa hàng lên shop để shipper đến lấy đồ ăn giao về cho khách,..."
    const nextTotalMoney = stats.money + earnAmount;
    const justUnlocked1M = !stats.hasReached1Million && nextTotalMoney >= 1000000;
    if (justUnlocked1M) {
      setShow1MillionBanner(true);
      sound.playUpgradeFanfare();
      try {
        confetti({
          particleCount: 160,
          spread: 120,
          origin: { y: 0.4 },
        });
      } catch {}
      setTimeout(() => setShow1MillionBanner(false), 9000);
    }

    // Update stats
    setStats((prev) => ({
      ...prev,
      money: nextTotalMoney,
      totalEarnedToday: prev.totalEarnedToday + earnAmount,
      customersServed: nextServed,
      perfectOrders: is100Percent ? prev.perfectOrders + 1 : prev.perfectOrders,
      reputation: Math.min(100, prev.reputation + (is100Percent ? 4 : 1)),
      hasReached1Million: prev.hasReached1Million || nextTotalMoney >= 1000000,
      highestMoneyReached: Math.max(prev.highestMoneyReached || 0, nextTotalMoney),
    }));

    // Customer finishes eating after 2.8 seconds
    setTimeout(() => {
      if (targetCustomer.visitsCount < targetCustomer.maxVisits) {
        returningQueueRef.current.push({
          customer: targetCustomer,
          returnAtTime: Date.now() + 10000,
        });
      }

      setTables((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((c) => c?.id === targetCustomer.id);
        if (idx !== -1) {
          copy[idx] = null;
          setTimeout(() => spawnCustomerAtTable(idx), 2200);
        }
        return copy;
      });
    }, 2800);
  };

  // Buy Shop Upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || stats.money < upgrade.cost) return;

    setStats((prev) => ({
      ...prev,
      money: prev.money - upgrade.cost,
    }));

    setUpgrades((prev) =>
      prev.map((u) => (u.id === upgradeId ? { ...u, purchased: true } : u))
    );
  };

  // Render Title Screen
  if (gameState === 'TITLE') {
    return (
      <>
        <TitleScreen
          chefAvatar={chefAvatar}
          gameMode={gameMode}
          isMuted={isMuted}
          onSelectMode={setGameMode}
          onStartGame={handleStartGame}
          onOpenWardrobe={() => setShowWardrobe(true)}
          onToggleMute={handleToggleMute}
        />
        {showWardrobe && (
          <WardrobeModal
            chefAvatar={chefAvatar}
            onUpdateAvatar={setChefAvatar}
            onClose={() => setShowWardrobe(false)}
          />
        )}
      </>
    );
  }

  // Active playing view
  const shiftMinutes = Math.floor(shiftTimeRemaining / 60);
  const shiftSeconds = shiftTimeRemaining % 60;
  const formattedShiftTime = `${shiftMinutes.toString().padStart(2, '0')}:${shiftSeconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50 flex flex-col justify-between overflow-x-hidden ${
        screenShake ? 'animate-screenshake' : ''
      }`}
    >
      {/* Top Rush Hour Announcement Banner */}
      {showRushHourBanner && (
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black py-2.5 px-4 text-center text-xs sm:text-sm shadow-2xl flex items-center justify-center gap-2 animate-bounce z-50">
          <Flame className="w-5 h-5 text-yellow-200 animate-spin" />
          <span>
            {gameMode === 'RUSH_60S'
              ? '⚡ GIAI ĐOẠN CHƠI NHANH BÙNG NỔ! TRÊN 10 KHÁCH: 3 NGƯỜI CÙNG TÍNH GIỜ 3 PHÚT (GIÁ 35.000Đ/TÔ)!'
              : '🔥 GIỜ CAO ĐIỂM BÙNG NỔ! ĐÃ PHỤC VỤ ĐỦ 8 KHÁCH! 3 BÀN TÍNH GIỜ 5 PHÚT ĐỒNG THỜI (GIÁ 30.000Đ/TÔ)!'}
          </span>
          <Flame className="w-5 h-5 text-yellow-200 animate-spin" />
        </div>
      )}

      {/* 1 Million VND Milestone Celebration Banner */}
      {show1MillionBanner && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-amber-950 font-black py-3 px-4 text-center text-xs sm:text-sm shadow-2xl flex items-center justify-center gap-2 animate-bounce z-50 border-y-2 border-yellow-200">
          <Sparkles className="w-5 h-5 text-amber-900 animate-spin" />
          <span>
            🎉 CHÚC MỪNG BẠN ĐẠT MỐC 1 TRIỆU ĐỒNG! ĐÃ TỰ ĐỘNG MỞ KHÓA GÓI 5 TRIỆU ĐƯA TIỆM LÊN APP SHIPPER & MÁY PHỞ TỰ ĐỘNG!
          </span>
          <Sparkles className="w-5 h-5 text-amber-900 animate-spin" />
        </div>
      )}

      {/* Shipper Delivery Floating Toast */}
      {shipperToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-3 px-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-emerald-300 animate-bounce">
          <span className="text-2xl">🛵</span>
          <div className="text-xs">
            <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-black flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              Đơn Online Đã Giao Thành Công
            </div>
            <span>{shipperToast}</span>
          </div>
        </div>
      )}

      {/* Top Navigation & Status HUD */}
      <header className="sticky top-0 z-30 bg-amber-950/95 border-b border-amber-800/80 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand & Chef Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowWardrobe(true)}
              title="Đổi diện mạo & trang phục"
              className="relative p-1 rounded-full bg-amber-900 border-2 border-amber-500 hover:border-amber-300 transition-all hover:scale-105 cursor-pointer"
            >
              <AvatarDisplay config={chefAvatar} mood="HAPPY" size="sm" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black text-amber-200 tracking-tight flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  Tiệm Phở Vui Vẻ
                </h1>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-800/80 text-amber-300 font-semibold border border-amber-700">
                  Ngày {stats.day}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                    gameMode === 'RUSH_60S'
                      ? 'bg-red-950 text-red-300 border-red-600/70'
                      : 'bg-amber-900 text-amber-200 border-amber-600/70'
                  }`}
                >
                  {gameMode === 'RUSH_60S' ? '⚡ Chơi Nhanh' : '🥢 Tiêu Chuẩn'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-amber-300 font-medium">
                {isRushHour ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                    {gameMode === 'RUSH_60S'
                      ? 'Chơi Nhanh: 3 khách cùng xuất hiện (3 phút)'
                      : 'Cao Điểm: 3 khách cùng lúc (5 phút)'}
                  </span>
                ) : (
                  <span className="text-amber-300">
                    {gameMode === 'RUSH_60S'
                      ? `Giai đoạn 1: 2 khách (1p30s) · Đã phục vụ ${stats.customersServed}/10 (trên 10 mở 3 khách 3p)`
                      : `Giai đoạn 1: 2 khách (3 phút) · Đã phục vụ ${stats.customersServed}/8`}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Stats Cluster: Money, Reputation, Slam Count, Shift Clock */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs font-semibold">
            {/* Money button */}
            <button
              id="wallet-money-counter"
              onClick={() => setShowUpgrades(true)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r border flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                isWalletPulsing
                  ? 'from-amber-500 to-yellow-400 border-yellow-200 text-amber-950 scale-110 shadow-[0_0_25px_rgba(250,204,21,0.9)] ring-4 ring-yellow-400'
                  : 'from-amber-900/90 to-amber-800/90 border-amber-500/80 hover:scale-105'
              }`}
              title="Xem ngân quỹ & mua đồ nâng cấp"
            >
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <span>Tiền:</span>
                {isWalletPulsing && <span className="animate-spin text-sm">🪙</span>}
              </span>
              <span className={`font-mono font-black text-xs sm:text-sm ${isWalletPulsing ? 'text-amber-950 font-extrabold' : 'text-emerald-300'}`}>
                {stats.money.toLocaleString('vi-VN')} đ
              </span>
            </button>

            {/* Customers Served progress towards rush threshold */}
            <div className="px-2.5 py-1.5 rounded-xl bg-amber-900/70 border border-amber-700/60 flex items-center gap-1 text-[11px]">
              <span className="text-amber-300">Khách:</span>
              <span className="font-mono font-bold text-amber-100">
                {stats.customersServed}
                {!isRushHour
                  ? gameMode === 'RUSH_60S'
                    ? '/10 (sắp mở 3p)'
                    : '/8 (sắp mở 5p)'
                  : ' (Đang 3 khách)'}
              </span>
            </div>

            {/* Tables Slammed */}
            <div
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 text-[11px] transition-colors ${
                stats.tablesSlammed > 0
                  ? 'bg-red-950/80 border-red-500/80 text-red-200'
                  : 'bg-amber-900/70 border-amber-700/60 text-amber-200'
              }`}
            >
              <span>{stats.tablesSlammed > 0 ? '💥 Đập bàn:' : '💢 Đập bàn:'}</span>
              <span className="font-mono font-black">{stats.tablesSlammed}</span>
            </div>

            {/* Reputation */}
            <div className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-amber-900/70 border border-amber-700/60 items-center gap-1">
              <span className="text-amber-300">⭐</span>
              <span className="font-mono font-bold text-amber-300">{stats.reputation}%</span>
            </div>

            {/* Shift timer */}
            <div className="px-2.5 py-1.5 rounded-xl bg-amber-950 border border-amber-800 flex items-center gap-1 font-mono text-[11px]">
              <span className="text-amber-400">Ca:</span>
              <span className="text-amber-200 font-bold">{formattedShiftTime}</span>
            </div>
          </div>

          {/* Action buttons with BGM controller */}
          <div className="flex items-center gap-1.5">
            {/* Music BGM Toggle */}
            <button
              onClick={handleToggleBGM}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                isBgmActive
                  ? 'bg-emerald-800 border-emerald-400 text-emerald-100 shadow'
                  : 'bg-amber-900 border-amber-700 text-amber-300 hover:bg-amber-800'
              }`}
              title={isBgmActive ? 'Đang phát nhạc nền tiệm phở' : 'Bật nhạc nền thư giãn'}
            >
              <Music className={`w-4 h-4 ${isBgmActive ? 'animate-bounce text-emerald-300' : ''}`} />
              <span className="hidden sm:inline">{isBgmActive ? 'Nhạc: Bật' : 'Nhạc: Tắt'}</span>
            </button>

            {/* Sound FX Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-amber-900 hover:bg-amber-800 border border-amber-700 text-amber-200 transition-colors cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Wardrobe */}
            <button
              onClick={() => setShowWardrobe(true)}
              className="p-2 rounded-xl bg-amber-900 hover:bg-amber-800 border border-amber-700 text-amber-200 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Tủ đồ diện mạo"
            >
              <Shirt className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Tủ đồ</span>
            </button>

            {/* Upgrades */}
            <button
              onClick={() => setShowUpgrades(true)}
              className="p-2 rounded-xl bg-amber-800 hover:bg-amber-700 border border-amber-500 text-amber-100 transition-all flex items-center gap-1 text-xs font-bold shadow cursor-pointer"
              title="Nâng cấp tiệm phở"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Nâng cấp</span>
            </button>

            {/* Pause */}
            <button
              onClick={() => setGameState(gameState === 'PLAYING' ? 'PAUSED' : 'PLAYING')}
              className="p-2 rounded-xl bg-amber-900 hover:bg-amber-800 border border-amber-700 text-amber-200 transition-colors cursor-pointer"
              title="Tạm dừng"
            >
              {gameState === 'PLAYING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="max-w-7xl w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col gap-4">
        {/* Shipper Delivery Banner if owned */}
        {upgrades.find((u) => u.id === 'online_delivery_shipper')?.purchased && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 border-2 border-emerald-500/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500 flex items-center justify-center text-2xl shadow">
                🛵
              </div>
              <div>
                <div className="text-xs font-black text-emerald-200 flex items-center gap-1.5">
                  <span>Ứng Dụng Giao Hàng Đang Hoạt Động (Shipper Grab/ShopeeFood)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-black text-[9px] uppercase animate-pulse">
                    Tự động nhận đơn
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  Shipper liên tục đến quán lấy 2 tô phở đi giao tận nơi (+150.000đ/đơn)!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 font-semibold">Đã giao thành công:</span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-900 border border-emerald-600 font-mono font-black text-yellow-300 text-sm">
                {stats.shipperDeliveriesCount || 0} đơn
              </span>
            </div>
          </div>
        )}

        {/* Top Section: Customer Tables */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span>Bàn Ăn Thực Khách ({tables.filter(Boolean).length}/{maxTables} bàn)</span>
              <span className="text-[11px] text-amber-400/80 font-normal">
                (Click vào bàn để chọn nấu cho vị khách đó)
              </span>
            </h2>
            <div className="text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isRushHour ? (
                <span className="text-red-300 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  🔥 Giờ Cao Điểm: 3 Khách Cùng Lúc · Giá {gameMode === 'RUSH_60S' ? '35.000đ' : '30.000đ'}/tô!
                </span>
              ) : (
                <span>
                  {gameMode === 'RUSH_60S'
                    ? 'Khách chờ 1m30s · Giá 30.000đ/tô'
                    : 'Khách 1 chờ 3 phút · Khách 2 tạm hoãn · Giá 20.000đ/tô'}
                </span>
              )}
            </div>
          </div>

          <div
            className={`grid gap-3 sm:gap-4 ${
              maxTables === 4
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                : maxTables === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {tables.map((customer, idx) => (
              <CustomerTable
                key={idx}
                customer={customer}
                tableIndex={idx}
                isSelected={activeTableIdx === idx}
                onSelect={() => setActiveTableIdx(idx)}
                onGiveTea={handleGiveTea}
                hasTeaUpgrade={upgrades.find((u) => u.id === 'free_ice_tea')?.purchased}
              />
            ))}
          </div>
        </div>

        {/* Bottom Section: Kitchen Cooking Station */}
        <div>
          <CookingStation
            customers={tables.filter((c): c is Customer => c !== null)}
            activeTableIdx={activeTableIdx}
            onSelectTable={setActiveTableIdx}
            onServeBowl={handleServeBowl}
          />
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="bg-amber-950/80 border-t border-amber-800/60 py-1.5 px-4 text-center text-[10px] sm:text-[11px] text-amber-400/70">
        Tiệm Phở Vui Vẻ · Khách đang tính giờ đợi quá hạn sẽ đập bàn bỏ đi!
      </footer>

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-amber-950 border-2 border-amber-600 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-black text-amber-100 mb-2">Đang Tạm Dừng</h3>
            <p className="text-xs text-amber-300 mb-5">
              Khách vẫn đang đợi. Nhấn tiếp tục để phục vụ!
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setGameState('PLAYING')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs transition-all shadow cursor-pointer"
              >
                Tiếp tục chơi
              </button>
              <button
                onClick={() => setGameState('TITLE')}
                className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-200 border border-amber-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Summary Modal */}
      {gameState === 'DAY_SUMMARY' && (
        <DaySummaryModal
          stats={stats}
          onNextDay={handleNextDay}
          onOpenUpgrades={() => setShowUpgrades(true)}
          onOpenWardrobe={() => setShowWardrobe(true)}
        />
      )}

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <WardrobeModal
          chefAvatar={chefAvatar}
          onUpdateAvatar={setChefAvatar}
          onClose={() => setShowWardrobe(false)}
        />
      )}

      {/* Shop Upgrades Modal */}
      {showUpgrades && (
        <ShopUpgradesModal
          money={stats.money}
          hasReached1Million={stats.hasReached1Million || stats.money >= 1000000}
          upgrades={upgrades}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setShowUpgrades(false)}
        />
      )}
      {/* Floating Money Particles & Fly-to-Wallet UI */}
      <FloatingMoneyRewardContainer
        rewards={rewards}
        onComplete={handleRewardComplete}
        onCoinHitWallet={handleCoinHitWallet}
      />
    </div>
  );
}
