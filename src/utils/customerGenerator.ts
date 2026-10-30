import { Customer, PhoOrder, AvatarConfig, BowlSize, NoodleType, BrothType, MeatType, HerbGarnish, GameMode } from '../types/game';

const VIETNAMESE_NAMES = [
  'Bác Năm Xe Ôm',
  'Chị Bảy Hột Vịt Lộn',
  'Anh Ba Lập Trình',
  'Cô Út Điệu Đà',
  'Chú Tám Bụng Bự',
  'Cụ Già Phố Cổ Sành Ăn',
  'Hotboy Trà Chanh',
  'Tiểu Thư Mê Quẩy',
  'Em Bé Đói Bụng',
  'Bà Tư Tạp Hóa',
  'Anh Hai Bốc Vác',
  'Cô Giáo Hiền Thục',
  'Đại Gia Bất Động Sản',
  'Chú Chín Câu Cá',
  'Chị Năm Bán Hoa',
  'Bác Sĩ Trực Ca',
  'Shipper Chạy Thâu Đêm',
  'Dì Tư Bánh Mì',
];

const CUSTOMER_TITLES = [
  'Khách quen khu phố',
  'Chuyên gia sành phở',
  'Khách qua đường',
  'Mối ruột của quán',
  'Thực khách khó tính',
  'Tín đồ ăn cay',
  'Người mê nước béo',
  'Khách du lịch phương xa',
];

const SKIN_TONES = ['#FAD7B0', '#F3C498', '#E6A87C', '#D88E62', '#FFE5D4'];
const HAIR_COLORS = ['#1C1917', '#292524', '#44403C', '#451A03', '#78350F'];
const OUTFIT_COLORS = ['#0284C7', '#DC2626', '#16A34A', '#EAB308', '#9333EA', '#D97706', '#0F172A', '#BE185D'];

const HAIR_STYLES: AvatarConfig['hairStyle'][] = [
  'short_neat',
  'undercut',
  'chef_toque',
  'bandana',
  'ponytail',
  'curly_bun',
  'traditional_conical',
];

const EYES_LIST: AvatarConfig['eyes'][] = ['friendly', 'sparkle', 'cool', 'glasses', 'focused'];
const MOUTHS_LIST: AvatarConfig['mouth'][] = ['smile', 'grin', 'mustache', 'calm'];
const OUTFITS_LIST: AvatarConfig['outfit'][] = ['ao_ba_ba', 'chef_uniform', 'streetwear', 'vintage_floral', 'dragon_master'];
const ACCESSORIES_LIST: AvatarConfig['accessory'][] = ['none', 'tea_towel', 'gold_necklace', 'apron_red', 'apron_yellow'];

export function generateRandomAvatar(): AvatarConfig {
  return {
    skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
    hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
    hairStyle: HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)],
    eyes: EYES_LIST[Math.floor(Math.random() * EYES_LIST.length)],
    mouth: MOUTHS_LIST[Math.floor(Math.random() * MOUTHS_LIST.length)],
    outfit: OUTFITS_LIST[Math.floor(Math.random() * OUTFITS_LIST.length)],
    outfitColor: OUTFIT_COLORS[Math.floor(Math.random() * OUTFIT_COLORS.length)],
    accessory: ACCESSORIES_LIST[Math.floor(Math.random() * ACCESSORIES_LIST.length)],
  };
}

export function generateRandomOrder(): PhoOrder {
  const bowlSizes: BowlSize[] = ['standard', 'to_lon', 'xe_lua'];
  const noodleTypes: NoodleType[] = ['banh_pho_mem', 'pho_tai_lan', 'pho_soi_to'];
  const brothTypes: BrothType[] = ['nuoc_thanh_bo', 'nuoc_beo_dam', 'nuoc_sa_te_cay'];
  
  const allMeats: MeatType[] = ['bo_tai', 'bo_nam_chin', 'gau_bo', 'bo_vien', 'trung_chan', 'suon_bo'];
  const allHerbs: HerbGarnish[] = ['hanh_la', 'ngo_gai', 'gia_do', 'ot_tuoi', 'chanh_tuoi', 'tuong_den_do', 'quay_gion'];

  const bowlSize = bowlSizes[Math.floor(Math.random() * bowlSizes.length)];
  const noodles = noodleTypes[Math.floor(Math.random() * noodleTypes.length)];
  const broth = brothTypes[Math.floor(Math.random() * brothTypes.length)];

  // Choose 1 to 3 meats
  const meatCount = bowlSize === 'xe_lua' ? 3 : bowlSize === 'to_lon' ? 2 : 1 + Math.floor(Math.random() * 2);
  const shuffledMeats = [...allMeats].sort(() => 0.5 - Math.random());
  const meats = shuffledMeats.slice(0, meatCount);

  // Choose 2 to 4 herbs/garnishes
  const herbCount = 2 + Math.floor(Math.random() * 3);
  const shuffledHerbs = [...allHerbs].sort(() => 0.5 - Math.random());
  const herbs = shuffledHerbs.slice(0, herbCount);

  // Special dialogue note
  const notes = [
    'Nhiều hành lá trần giúp tôi nhé!',
    'Cho nước dùng thật nóng hôi hổi!',
    'Đừng quên chanh và ớt tươi cay nồng!',
    'Thêm quẩy giòn nhúng nước béo ăn cho đã!',
    'Cho nhiều tương đen tương đỏ đậm đà nha chủ quán!',
  ];
  const specialNote = Math.random() > 0.4 ? notes[Math.floor(Math.random() * notes.length)] : undefined;

  return {
    bowlSize,
    noodles,
    broth,
    meats,
    herbs,
    specialNote,
  };
}

export function calculateOrderPrice(
  order: PhoOrder,
  gameMode: GameMode = 'REALISTIC_2MIN',
  isRushHour: boolean = false
): number {
  // USER RULE:
  // "bây giờ 1 bát phở bình thường phục vụ bên tiêu chuẩn chỉ đc 20 nghìn đồng thôi
  // còn bên chế độ nhanh thì sẽ đc 30 nghìn
  // còn đến lúc đông bên tiêu chuẩn sẽ được 30 nghìn 1 tô
  // còn bên chơi nhanh 35 nghìn đồng 1 tô"
  if (gameMode === 'REALISTIC_2MIN') {
    return isRushHour ? 30000 : 20000;
  } else {
    return isRushHour ? 35000 : 30000;
  }
}

export function createNewCustomer(
  tableIndex: number,
  isRushHour: boolean = false,
  isTimerActive: boolean = true,
  gameMode: GameMode = 'REALISTIC_2MIN',
  existingVisits?: { visitsCount: number; maxVisits: number; name: string; avatar: AvatarConfig }
): Customer {
  // USER RULES:
  // "chế độ tiêu chuẩn thì 3 phút chế độ nhanh thì 1 phút 30 giấy"
  // 1. Chế độ Tiêu chuẩn (REALISTIC_2MIN):
  //    - Giai đoạn bình thường: Khách chờ 3 phút (180s). Khách thứ 2 tạm hoãn chờ tới lượt.
  //    - Giai đoạn cao điểm (đủ 8 khách): 3 khách cùng xuất hiện đếm 5 phút (300s).
  // 2. Giai đoạn Chơi Nhanh (RUSH_60S):
  //    - Giai đoạn bình thường: Khách chờ 1 phút 30 giây (90s).
  //    - Giai đoạn cao điểm (trên 10 khách): 3 người cùng xuất hiện tính thời gian 3 phút (180s) cùng lúc!
  let maxWait = gameMode === 'REALISTIC_2MIN' ? 180 : 90; // Tiêu chuẩn: 3 phút (180s), Chơi nhanh: 1 phút 30 giây (90s)
  if (isRushHour) {
    if (gameMode === 'RUSH_60S') {
      maxWait = 180; // 3 phút (180s) cho giai đoạn chơi nhanh trên 10 khách
    } else {
      maxWait = 300; // 5 phút (300s) cho giai đoạn tiêu chuẩn từ 8 khách
    }
  }

  const avatar = existingVisits ? existingVisits.avatar : generateRandomAvatar();
  const name = existingVisits ? existingVisits.name : VIETNAMESE_NAMES[Math.floor(Math.random() * VIETNAMESE_NAMES.length)];
  const title = CUSTOMER_TITLES[Math.floor(Math.random() * CUSTOMER_TITLES.length)];
  const order = generateRandomOrder();
  const price = calculateOrderPrice(order, gameMode, isRushHour);

  // "khách sẽ 1 lần đến 2-3 lần"
  const maxVisits = existingVisits ? existingVisits.maxVisits : (1 + Math.floor(Math.random() * 3)); // 1, 2, or 3 times!
  const visitsCount = existingVisits ? existingVisits.visitsCount + 1 : 1;

  return {
    id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    title,
    avatar,
    order,
    maxWaitTime: maxWait,
    remainingTime: maxWait,
    state: 'WAITING',
    visitsCount,
    maxVisits,
    tableIndex,
    isTimerActive,
    hasReceivedTea: false,
    price,
  };
}

export const INGREDIENT_NAMES = {
  // Bowls
  standard: 'Tô Thường',
  to_lon: 'Tô Lớn',
  xe_lua: 'Tô Xe Lửa',

  // Noodles
  banh_pho_mem: 'Bánh phở mềm trắng',
  pho_tai_lan: 'Bánh phở tươi trụng kỹ',
  pho_soi_to: 'Phở sợi to bản dẹp',

  // Broths
  nuoc_thanh_bo: 'Nước dùng thanh ngọt',
  nuoc_beo_dam: 'Nước dùng béo ngậy',
  nuoc_sa_te_cay: 'Nước dùng sa tế cay',

  // Meats
  bo_tai: 'Bò Tái mỏng mềm',
  bo_nam_chin: 'Nạm Bò Chín thái thơm',
  gau_bo: 'Gầu Bò giòn sần sật',
  bo_vien: 'Bò Viên dai gân',
  trung_chan: 'Trứng Chần hột gà',
  suon_bo: 'Sườn Đuôi Bò hầm nhừ',

  // Herbs
  hanh_la: 'Hành lá & cọng hành',
  ngo_gai: 'Ngò gai & rau mùi',
  gia_do: 'Giá đỗ giòn ngọt',
  ot_tuoi: 'Ớt tươi xắt lát',
  chanh_tuoi: 'Chanh tươi vắt chua',
  tuong_den_do: 'Tương đen & Tương ớt',
  quay_gion: 'Quẩy giòn rụm',
};
