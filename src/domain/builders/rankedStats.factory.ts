import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import { LeagueEntryDTO } from '../dtos/LeagueEntryDTO';
import { RankedStats } from '../models/RankedStats';

export const buildRankedStats = (
  entries: LeagueEntryDTO[],
): RankedStats | undefined => {
  const rankedSoloDuoEntry = entries.find(
    entry => entry.queueType === 'RANKED_SOLO_5x5',
  );

  if (isUndefined(rankedSoloDuoEntry)) {
    return undefined;
  }

  const { wins, losses, tier, rank, leaguePoints, hotStreak } =
    rankedSoloDuoEntry;

  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  return {
    tier,
    rank,
    leaguePoints,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
    isHotStreak: hotStreak,
  };
};
