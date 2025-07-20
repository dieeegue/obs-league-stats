import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import { buildRankedStats } from '../builders/rankedStats.factory';
import { LeagueEntryDTO } from '../dtos/LeagueEntryDTO';
import { RankedStats } from '../models/RankedStats';

export const getRankedStats = async (
  gameName: string,
  tagLine: string,
): Promise<RankedStats> => {
  const response = await fetch(
    `/api/riot/ranked?gameName=${gameName}&tagLine=${tagLine}`,
  );
  const data = (await response.json()) as LeagueEntryDTO[];

  const rankedStats = buildRankedStats(data);

  if (isUndefined(rankedStats)) {
    throw new Error('No se encontraron datos de Solo/Duo Queue');
  }

  return rankedStats;
};
