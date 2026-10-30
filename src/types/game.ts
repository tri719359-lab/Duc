export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'DAY_SUMMARY' | 'WARDROBE' | 'UPGRADES';

export type GameMode = 'REALISTIC_2MIN' | 'RUSH_60S';

export type FaceMood = 'HAPPY' | 'PATIENT' | 'WORRIED' | 'ANGRY' | 'SLAMMING' | 'EATING';

export interface AvatarConfig {
  skinTone: string; // hex
  hairStyle: 'short_neat' | 'undercut' | 'chef_toque' | 'bandana' | 'ponytail' | 'curly_bun' | 'traditional_conical';
  hairColor: string;
  eyes: 'friendly' | 'sparkle' | 'cool' | 'glasses' | 'focused';
  mouth: 'smile' | 'grin' | 'mustache' | 'calm';
  outfit: 'ao_ba_ba' | 'chef_uniform' | 'streetwear' | 'vintage_floral' | 'dragon_master';
  outfitColor: string;
  accessory: 'none' | 'tea_towel' | 'gold_necklace' | 'apron_red' | 'apron_yellow';
}

export type NoodleType = 'banh_pho_mem' | 'pho_tai_lan' | 'pho_soi_to';
export type BrothType = 'nuoc_thanh_bo' | 'nuoc_beo_dam' | 'nuoc_sa_te_cay';
export type MeatType = 'bo_tai' | 'bo_nam_chin' | 'gau_bo' | 'bo_vien' | 'trung_chan' | 'suon_bo';
export type HerbGarnish = 'hanh_la' | 'ngo_gai' | 'gia_do' | 'ot_tuoi' | 'chanh_tuoi' | 'tuong_den_do' | 'quay_gion';
export type BowlSize = 'standard' | 'to_lon' | 'xe_lua';

export interface PhoOrder {
  bowlSize: BowlSize;
  noodles: NoodleType;
  broth: BrothType;
  meats: MeatType[];
  herbs: HerbGarnish[];
  specialNote?: string;
}

export interface PreparedBowl {
  bowlSize: BowlSize;
  noodles?: NoodleType;
  broth?: BrothType;
  meats: MeatType[];
  herbs: HerbGarnish[];
}

export interface Customer {
  id: string;
  name: string;
  title: string;
  avatar: AvatarConfig;
  order: PhoOrder;
  maxWaitTime: number; // in seconds (120 for 2 min, or 60 for rush)
  remainingTime: number; // in seconds
  state: 'WAITING' | 'SERVED' | 'EATING' | 'SLAPPED_TABLE_LEFT' | 'FINISHED_HAPPY';
  visitsCount: number; // 1, 2, or 3 times coming back
  maxVisits: number; // e.g. 2 or 3
  tableIndex: number;
  isTimerActive?: boolean; // true if timer is currently ticking down, false if waiting for turn
  hasReceivedTea?: boolean;
  slamAnimTimer?: number;
  dialogue?: string;
  price: number;
}

export interface RestaurantStats {
  money: number;
  day: number;
  reputation: number; // 0 - 100
  customersServed: number;
  tablesSlammed: number; // number of times customers slammed table and left
  perfectOrders: number;
  totalEarnedToday: number;
  hasReached1Million?: boolean;
  highestMoneyReached?: number;
  shipperDeliveriesCount?: number;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  desc: string;
  cost: number;
  purchased: boolean;
  icon: string;
  category: 'tables_decor' | 'kitchen_speed' | 'customer_happiness' | 'luxury_prestige' | 'delivery_online';
  requiredUnlockAmount?: number; // e.g. 1000000 (1 million VND)
  effectType:
    | 'extra_table_3'
    | 'extra_table_4'
    | 'ice_tea'
    | 'ginseng_tea'
    | 'air_conditioner'
    | 'neon_sign'
    | 'vip_bowls'
    | 'golden_ladle'
    | 'music_speaker'
    | 'wooden_chopping_board'
    | 'massage_chairs'
    | 'hoian_lanterns'
    | 'michelin_star'
    | 'crispy_quay_display'
    | 'online_delivery_shipper'
    | 'auto_noodle_machine'
    | 'electric_broth_vat'
    | 'drink_station'
    | 'international_franchise';
}

