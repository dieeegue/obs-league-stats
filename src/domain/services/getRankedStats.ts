import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import { buildUserStats } from '../builders/userStats.factory';
import { UserStats } from '../models/UserStats';

export const getRankedStats = async (
  gameName: string,
  tagLine: string,
): Promise<UserStats> => {
  const response = await fetch(
    `/api/riot/ranked?gameName=${gameName}&tagLine=${tagLine}`,
  );
  const { rankedStats, profileIconId } = await response.json();

  const userStats = buildUserStats(rankedStats, profileIconId);

  if (isUndefined(userStats)) {
    throw new Error('No se encontraron datos de Solo/Duo Queue');
  }

  return userStats;
};
