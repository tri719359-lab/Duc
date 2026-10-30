import React from 'react';
import { AvatarConfig, FaceMood } from '../types/game';

interface AvatarDisplayProps {
  config: AvatarConfig;
  mood?: FaceMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isCustomer?: boolean;
  className?: string;
  showTableSlamArms?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  config,
  mood = 'PATIENT',
  size = 'md',
  isCustomer = false,
  className = '',
  showTableSlamArms = false,
}) => {
  const pixelSizes = {
    sm: 48,
    md: 80,
    lg: 120,
    xl: 180,
  };
  const px = pixelSizes[size];

  // Mood adjustments
  const isAngry = mood === 'ANGRY' || mood === 'SLAMMING';
  const isWorried = mood === 'WORRIED';
  const isHappy = mood === 'HAPPY' || mood === 'EATING';

  // Skin tones
  const skin = config.skinTone || '#F5D0A9';
  const hair = config.hairColor || '#231F20';
  const outfitColor = config.outfitColor || '#0284c7';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        mood === 'SLAMMING' ? 'animate-bounce' : ''
      }`}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        {/* Steam effect if furious */}
        {isAngry && (
          <g className="animate-pulse opacity-85">
            {/* Steam from ears */}
            <path
              d="M10,48 Q4,42 8,36 T12,28"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M90,48 Q96,42 92,36 T88,28"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Angry mark # */}
            <path
              d="M74,18 L84,18 M74,24 L84,24 M77,15 L77,27 M81,15 L81,27"
              stroke="#dc2626"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Sweat drop if worried */}
        {isWorried && (
          <path
            d="M78,32 C78,30 84,38 84,41 C84,44 81,46 78,46 C75,46 72,44 72,41 C72,38 78,30 78,32 Z"
            fill="#38bdf8"
            className="animate-pulse"
          />
        )}

        {/* --- BODY & CLOTHING ("Mặc quần áo đàng hoàng") --- */}
        {/* Shoulders / Torso */}
        <path
          d="M20,95 Q22,72 35,70 L65,70 Q78,72 80,95 Z"
          fill={outfitColor}
        />

        {/* Specific outfit collar & details */}
        {config.outfit === 'ao_ba_ba' && (
          <g>
            {/* Bà Ba mandarin collar slit and buttons */}
            <path d="M50,70 L50,95" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="1,4" />
            <path d="M42,70 Q50,75 58,70" fill="none" stroke="#f1f5f9" strokeWidth="2" />
            <circle cx="50" cy="76" r="1.5" fill="#f8fafc" />
            <circle cx="50" cy="83" r="1.5" fill="#f8fafc" />
            <circle cx="50" cy="90" r="1.5" fill="#f8fafc" />
          </g>
        )}

        {config.outfit === 'chef_uniform' && (
          <g>
            {/* Double-breasted chef coat */}
            <path d="M40,70 L48,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="44" cy="77" r="1.5" fill="#334155" />
            <circle cx="56" cy="77" r="1.5" fill="#334155" />
            <circle cx="45" cy="85" r="1.5" fill="#334155" />
            <circle cx="55" cy="85" r="1.5" fill="#334155" />
            {/* Red neckerchief */}
            <polygon points="46,70 54,70 50,77" fill="#dc2626" />
          </g>
        )}

        {config.outfit === 'dragon_master' && (
          <g>
            <path d="M50,70 L50,95" stroke="#f59e0b" strokeWidth="2" />
            {/* Gold dragon embroidery motif */}
            <circle cx="36" cy="82" r="5" fill="#fbbf24" opacity="0.8" />
            <path d="M34,80 Q38,84 37,86" stroke="#b45309" strokeWidth="1" fill="none" />
          </g>
        )}

        {config.outfit === 'vintage_floral' && (
          <g opacity="0.6">
            <circle cx="32" cy="80" r="2.5" fill="#f43f5e" />
            <circle cx="68" cy="84" r="2.5" fill="#f43f5e" />
            <circle cx="40" cy="90" r="2" fill="#10b981" />
            <circle cx="60" cy="76" r="2" fill="#fbbf24" />
          </g>
        )}

        {/* Apron overlay if chef accessory */}
        {(config.accessory === 'apron_red' || config.accessory === 'apron_yellow') && (
          <path
            d="M32,73 L68,73 L65,95 L35,95 Z"
            fill={config.accessory === 'apron_red' ? '#b91c1c' : '#d97706'}
          />
        )}

        {/* Tea towel on shoulder */}
        {config.accessory === 'tea_towel' && (
          <path
            d="M24,72 Q22,85 24,94 L30,93 Q28,82 28,71 Z"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />
        )}

        {/* Gold necklace */}
        {config.accessory === 'gold_necklace' && (
          <path
            d="M40,70 Q50,79 60,70"
            fill="none"
            stroke="#eab308"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Neck */}
        <rect x="44" y="60" width="12" height="12" rx="2" fill={skin} />

        {/* --- HEAD & FACE ("Mặt mũi đàng hoàng") --- */}
        {/* Ears */}
        <circle cx="28" cy="49" r="6" fill={skin} />
        <circle cx="72" cy="49" r="6" fill={skin} />
        <circle cx="28" cy="49" r="3.5" fill="#d97706" opacity="0.3" />
        <circle cx="72" cy="49" r="3.5" fill="#d97706" opacity="0.3" />

        {/* Head Shape */}
        <rect
          x="30"
          y="24"
          width="40"
          height="45"
          rx="18"
          fill={isAngry ? '#fca5a5' : skin}
        />

        {/* Cheeks blush */}
        {isHappy && (
          <g opacity="0.45">
            <ellipse cx="37" cy="54" rx="4.5" ry="2.5" fill="#f43f5e" />
            <ellipse cx="63" cy="54" rx="4.5" ry="2.5" fill="#f43f5e" />
          </g>
        )}

        {/* Nose */}
        <path
          d="M50,45 L48,51 L52,51"
          stroke="#b45309"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- EYES & EYEBROWS --- */}
        {/* Eyebrows */}
        {isAngry ? (
          // Angry V-brows
          <g stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round">
            <line x1="34" y1="38" x2="44" y2="42" />
            <line x1="66" y1="38" x2="56" y2="42" />
          </g>
        ) : isWorried ? (
          // Worried brows
          <g stroke="#1c1917" strokeWidth="2" strokeLinecap="round">
            <line x1="34" y1="40" x2="44" y2="37" />
            <line x1="66" y1="40" x2="56" y2="37" />
          </g>
        ) : config.eyes === 'focused' ? (
          // Sharp focused brows
          <g stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round">
            <path d="M34,40 L45,38" />
            <path d="M66,40 L55,38" />
          </g>
        ) : (
          // Normal neat brows
          <g stroke="#1c1917" strokeWidth="2" strokeLinecap="round">
            <path d="M35,39 Q40,36 45,39" fill="none" />
            <path d="M55,39 Q60,36 65,39" fill="none" />
          </g>
        )}

        {/* Eye & Eyewear Details */}
        {mood === 'SLAMMING' ? (
          // Furious X eyes
          <g stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="36" y1="43" x2="44" y2="49" />
            <line x1="44" y1="43" x2="36" y2="49" />
            <line x1="56" y1="43" x2="64" y2="49" />
            <line x1="64" y1="43" x2="56" y2="49" />
          </g>
        ) : config.eyes === 'cool' ? (
          // Sunglasses - Always visible!
          <g>
            <path d="M32,42 L47,42 L45,52 L34,51 Z" fill="#0f172a" rx="2" />
            <path d="M53,42 L68,42 L66,51 L55,52 Z" fill="#0f172a" rx="2" />
            <line x1="47" y1="45" x2="53" y2="45" stroke="#0f172a" strokeWidth="2.5" />
            {/* Sunglasses reflection glares */}
            <line x1="35" y1="44" x2="43" y2="50" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <line x1="56" y1="44" x2="64" y2="50" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </g>
        ) : config.eyes === 'glasses' ? (
          // Intellectual round glasses with eyes inside
          <g>
            {/* Eyes behind glass */}
            {isHappy ? (
              <g stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none">
                <path d="M36,46 Q40,42 44,46" />
                <path d="M56,46 Q60,42 64,46" />
              </g>
            ) : (
              <g>
                <circle cx="40" cy="46" r="3" fill="#1e293b" />
                <circle cx="60" cy="46" r="3" fill="#1e293b" />
                <circle cx="39" cy="45" r="1" fill="#ffffff" />
                <circle cx="59" cy="45" r="1" fill="#ffffff" />
              </g>
            )}
            {/* Lenses and Frame */}
            <circle cx="40" cy="46" r="6.5" fill="#ffffff" fillOpacity="0.25" stroke="#78350f" strokeWidth="2" />
            <circle cx="60" cy="46" r="6.5" fill="#ffffff" fillOpacity="0.25" stroke="#78350f" strokeWidth="2" />
            <line x1="46.5" y1="46" x2="53.5" y2="46" stroke="#78350f" strokeWidth="2" />
            <line x1="33.5" y1="46" x2="28" y2="45" stroke="#78350f" strokeWidth="1.5" />
            <line x1="66.5" y1="46" x2="72" y2="45" stroke="#78350f" strokeWidth="1.5" />
            {/* Glass lens glare */}
            <path d="M37,42 Q42,42 43,45" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
            <path d="M57,42 Q62,42 63,45" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
          </g>
        ) : config.eyes === 'sparkle' ? (
          // Sparkling enthusiastic eyes
          <g>
            <circle cx="40" cy="46" r="4.2" fill="#0f172a" />
            <circle cx="60" cy="46" r="4.2" fill="#0f172a" />
            {/* Sparkle star highlights */}
            <polygon points="40,43.5 41,45 42.5,45 41.2,46 41.7,47.5 40,46.5 38.3,47.5 38.8,46 37.5,45 39,45" fill="#fef08a" />
            <polygon points="60,43.5 61,45 62.5,45 61.2,46 61.7,47.5 60,46.5 58.3,47.5 58.8,46 57.5,45 59,45" fill="#fef08a" />
            <circle cx="38.5" cy="44" r="1.5" fill="#ffffff" />
            <circle cx="58.5" cy="44" r="1.5" fill="#ffffff" />
          </g>
        ) : config.eyes === 'focused' ? (
          // Intense focused chef eyes
          <g>
            <path d="M34,44 Q40,42 46,45 Q40,49 34,44 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
            <path d="M54,45 Q60,42 66,44 Q60,49 54,45 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
            <circle cx="40" cy="45.5" r="2.8" fill="#0f172a" />
            <circle cx="60" cy="45.5" r="2.8" fill="#0f172a" />
            <circle cx="39.2" cy="44.8" r="1" fill="#ffffff" />
            <circle cx="59.2" cy="44.8" r="1" fill="#ffffff" />
          </g>
        ) : isHappy && isCustomer ? (
          // Customer happy smiling eye curves when eating
          <g stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none">
            <path d="M36,46 Q40,41 44,46" />
            <path d="M56,46 Q60,41 64,46" />
          </g>
        ) : (
          // Friendly natural round open eyes
          <g>
            <circle cx="40" cy="46" r="3.8" fill="#1e293b" />
            <circle cx="60" cy="46" r="3.8" fill="#1e293b" />
            <circle cx="38.8" cy="44.5" r="1.5" fill="#ffffff" />
            <circle cx="58.8" cy="44.5" r="1.5" fill="#ffffff" />
            <circle cx="41.5" cy="47" r="0.8" fill="#ffffff" />
            <circle cx="61.5" cy="47" r="0.8" fill="#ffffff" />
          </g>
        )}

        {/* --- MOUTH & MUSTACHE --- */}
        {config.mouth === 'mustache' && (
          <g>
            <path
              d="M42,54 Q50,51 58,54 Q55,59 50,56 Q45,59 42,54 Z"
              fill="#292524"
            />
            {/* Smile under mustache */}
            <path
              d="M45,58 Q50,62 55,58"
              stroke="#b91c1c"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {config.mouth !== 'mustache' && (
          <>
            {mood === 'SLAMMING' ? (
              // Wide open shouting angry mouth with sharp teeth
              <g>
                <path d="M42,56 Q50,54 58,56 Q55,66 45,66 Z" fill="#991b1b" />
                <polygon points="44,56 46,58 48,56 50,58 52,56 54,58 56,56" fill="#ffffff" />
              </g>
            ) : isAngry ? (
              // Gritting fuming mouth
              <path
                d="M43,59 Q50,55 57,59"
                stroke="#991b1b"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : isWorried ? (
              // Wavy nervous mouth
              <path
                d="M43,58 Q46,60 50,57 T57,59"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : config.mouth === 'grin' ? (
              // Big radiant toothy smile
              <g>
                <path d="M41,55 Q50,66 59,55 Z" fill="#b91c1c" />
                <path d="M43,55 Q50,59 57,55 Z" fill="#ffffff" />
              </g>
            ) : config.mouth === 'calm' ? (
              // Calm polite gentle smile line
              <path
                d="M43,57 Q50,61 57,57"
                stroke="#334155"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Default warm friendly smile
              <path
                d="M42,56 Q50,63 58,56"
                stroke="#b91c1c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </>
        )}

        {/* --- HAIRSTYLES & HEADGEAR --- */}
        {config.hairStyle === 'short_neat' && (
          <path
            d="M28,32 Q32,18 50,18 Q68,18 72,32 Q65,24 50,23 Q35,24 28,32 Z"
            fill={hair}
          />
        )}

        {config.hairStyle === 'undercut' && (
          <g>
            <path
              d="M30,32 Q36,15 52,16 Q65,17 72,26 L70,32 Q58,22 42,22 Z"
              fill={hair}
            />
            {/* Fade lines */}
            <path d="M28,34 L28,42" stroke={hair} strokeWidth="2" strokeDasharray="1,2" />
          </g>
        )}

        {config.hairStyle === 'curly_bun' && (
          <g>
            {/* Big bun on top */}
            <circle cx="50" cy="16" r="10" fill={hair} />
            <path
              d="M28,34 Q34,22 50,22 Q66,22 72,34 Q64,28 50,28 Q36,28 28,34 Z"
              fill={hair}
            />
          </g>
        )}

        {config.hairStyle === 'ponytail' && (
          <g>
            <path
              d="M28,32 Q34,20 50,20 Q66,20 72,32 Q64,26 50,26 Q36,26 28,32 Z"
              fill={hair}
            />
            {/* Ponytail side sweep */}
            <path
              d="M66,26 Q78,24 76,42 Q72,36 68,34 Z"
              fill={hair}
            />
          </g>
        )}

        {config.hairStyle === 'chef_toque' && (
          <g>
            {/* White tall chef hat */}
            <path
              d="M36,26 L64,26 L64,22 L36,22 Z"
              fill="#e2e8f0"
            />
            <path
              d="M36,22 C32,12 38,4 45,8 C47,3 53,3 55,8 C62,4 68,12 64,22 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* Hat brim pleats */}
            <line x1="43" y1="12" x2="43" y2="22" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="22" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="57" y1="12" x2="57" y2="22" stroke="#e2e8f0" strokeWidth="1" />
          </g>
        )}

        {config.hairStyle === 'bandana' && (
          <g>
            {/* Red chef bandana tied around forehead */}
            <path
              d="M28,30 Q50,26 72,30 L71,36 Q50,32 29,36 Z"
              fill="#dc2626"
            />
            {/* Tie knot on side */}
            <polygon points="70,34 76,31 77,39" fill="#dc2626" />
          </g>
        )}

        {config.hairStyle === 'traditional_conical' && (
          <g>
            {/* Vietnamese Nón Lá */}
            <polygon points="50,4 16,33 84,33" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            <line x1="50" y1="4" x2="50" y2="33" stroke="#f59e0b" strokeWidth="0.8" />
            <line x1="28" y1="24" x2="72" y2="24" stroke="#f59e0b" strokeWidth="0.6" />
            <line x1="38" y1="15" x2="62" y2="15" stroke="#f59e0b" strokeWidth="0.6" />
            {/* Chin strap */}
            <path d="M30,33 Q50,48 70,33" fill="none" stroke="#0284c7" strokeWidth="1.5" />
          </g>
        )}

        {/* Arms banging table if slamming! */}
        {(showTableSlamArms || mood === 'SLAMMING') && (
          <g className="animate-pulse">
            {/* Hands slamming down */}
            <rect x="14" y="82" width="16" height="12" rx="4" fill={skin} stroke="#78350f" strokeWidth="1.5" />
            <rect x="70" y="82" width="16" height="12" rx="4" fill={skin} stroke="#78350f" strokeWidth="1.5" />
            {/* Impact stars */}
            <path d="M12,78 L15,82 L8,82 Z" fill="#facc15" />
            <path d="M88,78 L85,82 L92,82 Z" fill="#facc15" />
          </g>
        )}
      </svg>
    </div>
  );
};
