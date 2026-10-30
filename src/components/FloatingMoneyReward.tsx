import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export interface RewardEvent {
  id: string;
  amount: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isPerfect?: boolean;
  createdAt: number;
}

interface FloatingMoneyRewardProps {
  rewards: RewardEvent[];
  onComplete: (id: string) => void;
  onCoinHitWallet?: () => void;
}

interface AnimatedCoin {
  id: number;
  delay: number;
  curveOffset: number;
  scale: number;
  rotation: number;
}

const COIN_COUNT = 7;
const COINS_CONFIG: AnimatedCoin[] = Array.from({ length: COIN_COUNT }, (_, i) => ({
  id: i,
  delay: i * 70, // 0ms, 70ms, 140ms, ...
  curveOffset: (i % 2 === 0 ? 1 : -1) * (20 + (i * 12)),
  scale: 0.9 + Math.random() * 0.3,
  rotation: Math.random() * 360,
}));

// Burst particles around the table
const BURST_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 45 + (i % 3) * 18;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    scale: 0.8 + (i % 3) * 0.3,
    icon: i % 2 === 0 ? '🪙' : '✨',
  };
});

const SingleReward: React.FC<{
  reward: RewardEvent;
  onComplete: (id: string) => void;
  onCoinHitWallet?: () => void;
}> = ({ reward, onComplete, onCoinHitWallet }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1250; // ms total duration

    let animationFrameId: number;
    let hasTriggeredWalletHit = false;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      // Trigger wallet hit when coins arrive (~650ms to 950ms)
      if (!hasTriggeredWalletHit && elapsed > 750) {
        hasTriggeredWalletHit = true;
        if (onCoinHitWallet) onCoinHitWallet();
      }

      if (p < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        onComplete(reward.id);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reward, onComplete, onCoinHitWallet]);

  // Interpolation for flying coins with bezier arc
  const totalDx = reward.endX - reward.startX;
  const totalDy = reward.endY - reward.startY;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 1. Floating Price Badge: Emerges from table, floats up with bounce and glowing tag */}
      {progress < 0.95 && (
        <div
          style={{
            position: 'absolute',
            left: `${reward.startX}px`,
            top: `${reward.startY - 35 - progress * 55}px`,
            transform: `translate(-50%, -50%) scale(${
              progress < 0.2
                ? 0.4 + (progress / 0.2) * 0.7
                : progress > 0.75
                ? 1.1 - ((progress - 0.75) / 0.2) * 0.3
                : 1.1
            })`,
            opacity: progress > 0.75 ? Math.max(0, 1 - (progress - 0.75) / 0.2) : 1,
            transition: 'opacity 0.2s ease-out',
          }}
          className="z-50 flex flex-col items-center"
        >
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-yellow-200 text-amber-950 font-black shadow-[0_0_20px_rgba(250,204,21,0.8)]">
            <span className="text-base sm:text-lg animate-spin" style={{ animationDuration: '3s' }}>
              🪙
            </span>
            <span className="text-sm sm:text-base tracking-wide font-mono drop-shadow">
              +{reward.amount.toLocaleString('vi-VN')} đ
            </span>
            {reward.isPerfect && (
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold ml-1 animate-pulse">
                +Boa chuẩn vị!
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] bg-amber-950/80 px-2 py-0.5 rounded-full mt-1 border border-amber-600/60">
            Khách thanh toán thành công ✨
          </span>
        </div>
      )}

      {/* 2. Coin Particles Eruption: Radial burst around the table */}
      {progress < 0.45 && (
        <div
          style={{
            position: 'absolute',
            left: `${reward.startX}px`,
            top: `${reward.startY}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="z-40"
        >
          {BURST_PARTICLES.map((bp) => {
            const burstProgress = Math.min(1, progress / 0.4);
            const currentDistX = bp.dx * burstProgress;
            const currentDistY = bp.dy * burstProgress;
            const opacity = 1 - burstProgress;
            return (
              <div
                key={bp.id}
                style={{
                  position: 'absolute',
                  transform: `translate(${currentDistX}px, ${currentDistY}px) scale(${bp.scale * (1 + burstProgress * 0.4)})`,
                  opacity,
                  transition: 'opacity 0.1s linear',
                }}
                className="text-sm select-none pointer-events-none drop-shadow"
              >
                {bp.icon}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Flying Coins Stream: Coins flying from Customer Table to Wallet Counter */}
      {COINS_CONFIG.map((coin) => {
        // Individual coin progress with delay
        const coinStartProgress = coin.delay / 1250;
        const coinDuration = 0.55; // 55% of the total duration
        if (progress < coinStartProgress) return null;

        const coinLocalP = Math.min(1, Math.max(0, (progress - coinStartProgress) / coinDuration));
        if (coinLocalP >= 1) return null; // already arrived

        // Ease in-out quadratic for natural flight
        const t = coinLocalP < 0.5 ? 2 * coinLocalP * coinLocalP : -1 + (4 - 2 * coinLocalP) * coinLocalP;

        // Quadratic Bezier arc control point
        const controlX = reward.startX + totalDx * 0.4 + coin.curveOffset;
        const controlY = Math.min(reward.startY, reward.endY) - 90; // arc up into air

        // Bezier formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const currentX = (1 - t) * (1 - t) * reward.startX + 2 * (1 - t) * t * controlX + t * t * reward.endX;
        const currentY = (1 - t) * (1 - t) * reward.startY + 2 * (1 - t) * t * controlY + t * t * reward.endY;

        // Scale shrinks slightly as coin reaches wallet pocket
        const currentScale = coin.scale * (1.2 - t * 0.35);

        return (
          <div
            key={coin.id}
            style={{
              position: 'absolute',
              left: `${currentX}px`,
              top: `${currentY}px`,
              transform: `translate(-50%, -50%) scale(${currentScale}) rotate(${t * 360 + coin.rotation}deg)`,
              filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.9))',
            }}
            className="z-50 select-none flex items-center justify-center"
          >
            {/* Golden 3D Coin Badge */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-2 border-yellow-100 flex items-center justify-center shadow-lg">
              <span className="text-amber-950 font-black text-xs sm:text-sm select-none">
                đ
              </span>
              <div className="absolute inset-0.5 rounded-full border border-amber-500/60 pointer-events-none" />
              <div className="absolute -top-1 -right-1 text-[10px] text-yellow-200 animate-ping">
                ✨
              </div>
            </div>
          </div>
        );
      })}

      {/* 4. Target Impact Flash (Gold spark on wallet arrival) */}
      {progress > 0.65 && progress < 0.95 && (
        <div
          style={{
            position: 'absolute',
            left: `${reward.endX}px`,
            top: `${reward.endY}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="z-50 pointer-events-none"
        >
          <div className="w-14 h-14 rounded-full bg-yellow-400/30 blur-md animate-ping" />
          <div className="absolute -top-3 -left-3 text-base text-yellow-300 animate-bounce">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export const FloatingMoneyRewardContainer: React.FC<FloatingMoneyRewardProps> = ({
  rewards,
  onComplete,
  onCoinHitWallet,
}) => {
  if (rewards.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {rewards.map((reward) => (
        <SingleReward
          key={reward.id}
          reward={reward}
          onComplete={onComplete}
          onCoinHitWallet={onCoinHitWallet}
        />
      ))}
    </div>
  );
};
