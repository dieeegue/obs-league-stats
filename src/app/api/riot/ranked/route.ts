import { isUndefined } from '@LeagueStatsOverlay/common/utils/isUndefined';
import { NextRequest, NextResponse } from 'next/server';

const riotApiKey = process.env.RIOT_API_KEY;

export async function GET(request: NextRequest) {
  if (isUndefined(riotApiKey)) {
    throw new Error('RIOT_API_KEY is undefined');
  }

  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  if (!gameName || !tagLine) {
    return NextResponse.json({}, { status: 422 });
  }

  try {
    const accountResponse = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      },
    );

    if (!accountResponse.ok) {
      return NextResponse.json({}, { status: 500 });
    }
    const { puuid } = await accountResponse.json();

    const rankedResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      },
    );

    if (!rankedResponse.ok) {
      return NextResponse.json({}, { status: 500 });
    }
    const rankedStats = await rankedResponse.json();

    return NextResponse.json(rankedStats);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
