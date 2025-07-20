'use client';

import { isNull } from '@LeagueStatsOverlay/common/utils/isNull';
import { getRankedStats } from '@LeagueStatsOverlay/domain/services/getRankedStats';
import { getTierColor } from '@LeagueStatsOverlay/common/utils/getTierColor';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RankedStats } from '@LeagueStatsOverlay/domain/models/RankedStats';
import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import Image from 'next/image';

export default function PlayerCard() {
  const [hasError, setHasError] = useState(false);
  const [rankedStats, setRankedStats] = useState<RankedStats | undefined>(
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
    <div className="flex flex-col items-center justify-center">
      <Image
        src={`/ranked/${rankedStats.tier}.png`}
        alt={rankedStats.tier}
        width={150}
        height={150}
      />
      <p className="ml-[5px] font-bold text-2xl text-shadow-custom">
        {gameName}
      </p>
      <p className="ml-[5px] font-bold text-sm text-shadow-custom">
        <span className={getTierColor(rankedStats.tier)}>
          {rankedStats.tier} {rankedStats.rank}
        </span>
        {` ${rankedStats.leaguePoints} LP`}
      </p>
      <p className="ml-[5px] font-bold text-sm text-shadow-custom">
        {rankedStats.wins}W - {rankedStats.losses}L{' '}
        <span className={getTierColor(rankedStats.tier)}>
          {rankedStats.winRate}% WR
        </span>
      </p>
    </div>
  );
}
