'use client';

import { isNull } from '@LeagueStatsOverlay/common/utils/isNull';
import { getRankedStats } from '@LeagueStatsOverlay/domain/services/getRankedStats';
import { getTierColor } from '@LeagueStatsOverlay/common/utils/getTierColor';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { UserStats } from '@LeagueStatsOverlay/domain/models/UserStats';
import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import Image from 'next/image';

function PlayerCard() {
  const [hasError, setHasError] = useState(false);
  const [rankedStats, setRankedStats] = useState<UserStats | undefined>(
    undefined,
  );

  const searchParams = useSearchParams();
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  const getUserStats = async () => {
    try {
      if (isNull(gameName) || isNull(tagLine)) {
        setHasError(true);
        return;
      }

      const rankedStats = await getRankedStats(gameName, tagLine);
      setRankedStats(rankedStats);
    } catch {
      setHasError(true);
    }
  };

  useEffect(() => {
    getUserStats();
  }, [gameName, tagLine]);

  if (hasError) {
    return <div>Error al cargar los datos</div>;
  }

  const isLoading = isUndefined(rankedStats);
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl shadow-black/10 w-fit px-4 py-4 rounded-lg">
        <div
          className="relative flex justify-center"
          style={{
            width: '208px',
            height: '210px',
            marginTop: '-120px',
          }}
        >
          <Image
            src={`/ranked/plates/icons/wings_${rankedStats.tier.toLowerCase()}.png`}
            alt={rankedStats.tier}
            width={208}
            height={270}
            className="absolute"
            style={{
              left: '50%',
              top: '0',
              transform: 'translateX(-50%)',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              zIndex: 10,
            }}
          />
          <Image
            src={`https://cdn.communitydragon.org/latest/profile-icon/${rankedStats.profileIconId}`}
            alt="Profile Icon"
            width={76}
            height={76}
            className="absolute rounded-full"
            style={{
              top: '126px',
              left: '66.5px',
              zIndex: 5,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {rankedStats.tier !== 'IRON' && (
            <video
              className="absolute w-full h-auto"
              style={{
                left: '50%',
                top: '0',
                transform: 'translateX(-50%)',
              }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={`/ranked/plates/animations/emblem-wings-magic-${rankedStats.tier.toLowerCase()}.webm`}
                type="video/webm"
              />
            </video>
          )}
        </div>
        <p className="ml-[5px] font-bold text-3xl text-shadow-custom mt-4">
          {gameName}
        </p>
        <p className="ml-[5px] font-bold text-md text-shadow-custom">
          <span className={getTierColor(rankedStats.tier)}>
            {rankedStats.tier} {rankedStats.rank}
          </span>
          {` ${rankedStats.leaguePoints} LP`}
        </p>
        <p className="ml-[5px] font-bold text-md text-shadow-custom">
          {rankedStats.wins}W - {rankedStats.losses}L{' '}
          <span className={getTierColor(rankedStats.tier)}>
            {rankedStats.winRate}% WR
          </span>
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div>Cargando...</div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PlayerCard />
    </Suspense>
  );
}
