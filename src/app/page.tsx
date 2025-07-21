'use client';

import { getRankedStats } from '@LeagueStatsOverlay/domain/services/getRankedStats';
import { getTierColor } from '@LeagueStatsOverlay/common/utils/getTierColor';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { UserStats } from '@LeagueStatsOverlay/domain/models/UserStats';
import Image from 'next/image';
import useSWR from 'swr';

const fetchPlayerStats = async ([gameName, tagLine]: [string, string]) => {
  return await getRankedStats(gameName, tagLine);
};

function PlayerCard() {
  const searchParams = useSearchParams();
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  const swrKey = gameName && tagLine ? ([gameName, tagLine] as const) : null;

  const {
    data: rankedStats,
    error,
    isLoading,
  } = useSWR<UserStats>(swrKey, fetchPlayerStats, {
    refreshInterval: 30000,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    keepPreviousData: true,
  });

  if (!gameName || !tagLine) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 font-bold mb-4">
            Parámetros requeridos
          </h2>
          <p className="text-gray-600">
            Agrega ?gameName=TuNombre&tagLine=TuTag a la URL
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Ejemplo: ?gameName=Hide on bush&tagLine=KR1
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 font-bold mb-4 text-red-500">
            Error al cargar los datos
          </h2>
          <p className="text-sm text-gray-600">
            Verifica que el nombre y tag sean correctos: {gameName}#{tagLine}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-pulse">
            <h2 className="text-xl text-gray-600 font-bold mb-4">
              Cargando datos...
            </h2>
            <p className="text-sm text-gray-600">
              {gameName}#{tagLine}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!rankedStats) return null;

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
  return <div className="min-h-screen flex items-center justify-center" />;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PlayerCard />
    </Suspense>
  );
}
