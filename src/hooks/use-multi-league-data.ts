import { useState, useEffect, useCallback, useRef } from 'react';
import { Game, ESPNResponse } from '@/types/sports';
import { sampleNFLGames, sampleNCAAFGames } from '@/lib/sample-data';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football';

export function useMultiLeagueData() {
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [ncaafGames, setNcaafGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadFallbackData = useCallback(async () => {
    try {
      const [nflFallback, ncaafFallback] = await Promise.all([
        window.spark.kv.get<Game[]>('sample-nfl-games'),
        window.spark.kv.get<Game[]>('sample-ncaaf-games')
      ]);

      // If no stored sample data, use the imported sample data
      const nflData = nflFallback || sampleNFLGames;
      const ncaafData = ncaafFallback || sampleNCAAFGames;

      if (!nflFallback || !ncaafFallback) {
        try {
          await Promise.all([
            window.spark.kv.set('sample-nfl-games', nflData),
            window.spark.kv.set('sample-ncaaf-games', ncaafData)
          ]);
        } catch (storageErr) {
          console.warn('Failed to store sample data:', storageErr);
        }
      }

      setNflGames(nflData);
      setNcaafGames(ncaafData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load fallback data:', err);
      // Use imported sample data as last resort
      setNflGames(sampleNFLGames);
      setNcaafGames(sampleNCAAFGames);
      setLastUpdated(new Date());
    }
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nflResponse, ncaafResponse] = await Promise.all([
        fetch(`${ESPN_API_BASE}/nfl/scoreboard`),
        fetch(`${ESPN_API_BASE}/college-football/scoreboard`)
      ]);

      if (!nflResponse.ok || !ncaafResponse.ok) {
        throw new Error('ESPN API error');
      }

      const [nflData, ncaafData] = await Promise.all([
        nflResponse.json() as Promise<ESPNResponse>,
        ncaafResponse.json() as Promise<ESPNResponse>
      ]);

      const processGames = (data: ESPNResponse, league: 'nfl' | 'college-football'): Game[] => {
        return data.events.map(event => ({
          id: event.id,
          date: event.date,
          status: {
            type: {
              id: event.status.type.id,
              name: event.status.type.name,
              state: event.status.type.state,
              completed: event.status.type.completed,
              detail: event.status.type.detail,
              shortDetail: event.status.type.shortDetail
            },
            displayClock: event.status.displayClock,
            period: event.status.period
          },
          league,
          competitions: event.competitions.map(comp => ({
            id: comp.id,
            competitors: comp.competitors.map(competitor => ({
              id: competitor.id,
              team: {
                id: competitor.team.id,
                name: competitor.team.name,
                abbreviation: competitor.team.abbreviation,
                displayName: competitor.team.displayName,
                color: competitor.team.color || '#000000',
                logo: competitor.team.logo || ''
              },
              score: competitor.score || '0',
              timeouts: competitor.timeouts || 0,
              records: (competitor.records || []).map(record => ({
                summary: record.summary,
                type: record.type
              })),
              curatedRank: competitor.curatedRank,
              rank: competitor.rank
            })),
            situation: comp.situation ? {
              lastPlay: comp.situation.lastPlay ? {
                text: comp.situation.lastPlay.text
              } : undefined,
              down: comp.situation.down,
              distance: comp.situation.distance,
              yardLine: comp.situation.yardLine,
              possession: comp.situation.possession
            } : undefined,
            venue: comp.venue ? {
              id: comp.venue.id,
              fullName: comp.venue.fullName,
              address: comp.venue.address ? {
                city: comp.venue.address.city,
                state: comp.venue.address.state
              } : undefined
            } : undefined,
            broadcasts: (comp.broadcasts || []).map(broadcast => ({
              names: broadcast.names || [],
              market: broadcast.market
            }))
          }))
        }));
      };

      const processedNflGames = processGames(nflData, 'nfl');
      const processedNcaafGames = processGames(ncaafData, 'college-football');

      setNflGames(processedNflGames);
      setNcaafGames(processedNcaafGames);
      setLastUpdated(new Date());

      // Store successful data as backup
      try {
        await Promise.all([
          window.spark.kv.set('last-nfl-games', processedNflGames),
          window.spark.kv.set('last-ncaaf-games', processedNcaafGames)
        ]);
      } catch (storageErr) {
        console.warn('Failed to store games data:', storageErr);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
      console.error('Sports API Error:', err);

      // Load fallback data when API fails
      await loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, [loadFallbackData]);

  // Use ref to store the latest fetchGames function
  const fetchGamesRef = useRef(fetchGames);
  useEffect(() => {
    fetchGamesRef.current = fetchGames;
  }, [fetchGames]);

  useEffect(() => {
    // Initial data load
    fetchGamesRef.current();

    // Set up auto-refresh - uses ref to always call the latest fetchGames
    const interval = setInterval(() => {
      fetchGamesRef.current();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []); // Only run on mount to set up interval

  const allGames = [...nflGames, ...ncaafGames];
  
  const liveGames = allGames.filter(game =>
    game.status && game.status.type && game.status.type.state === 'in'
  );
  
  const upcomingGames = allGames.filter(game =>
    game.status && game.status.type && game.status.type.state === 'pre'
  );
  
  const completedGames = allGames.filter(game =>
    game.status && game.status.type && game.status.type.state === 'post'
  );

  return {
    nflGames,
    ncaafGames,
    allGames,
    liveGames,
    upcomingGames,
    completedGames,
    loading,
    error,
    lastUpdated,
    refresh: fetchGames
  };
}
