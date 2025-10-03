import { useState, useEffect, useCallback } from 'react';
import { Game, League, ESPNResponse } from '@/types/sports';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football';

export function useSportsData(league: League) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadFallbackData = useCallback(async () => {
    try {
      const fallbackKey = league === 'nfl' ? 'sample-nfl-games' : 'sample-ncaaf-games';
      const fallbackData = await window.spark.kv.get<Game[]>(fallbackKey);
      if (fallbackData) {
        setGames(fallbackData);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to load fallback data:', err);
    }
  }, [league]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = league === 'nfl' ? 'nfl' : 'college-football';
      const response = await fetch(`${ESPN_API_BASE}/${endpoint}/scoreboard`);
      
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status}`);
      }
      
      const data: ESPNResponse = await response.json();
      
      const processedGames: Game[] = data.events.map(event => ({
        ...event,
        league,
        competitions: event.competitions.map(comp => ({
          ...comp,
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
            timeouts: competitor.timeouts || 0
          }))
        }))
      }));
      
      setGames(processedGames);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
      console.error('Sports API Error:', err);
      
      // Load fallback data when API fails
      await loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, [league, loadFallbackData]);

  useEffect(() => {
    fetchGames();
    
    // Set up auto-refresh for live games
    const interval = setInterval(() => {
      const hasLiveGames = games.some(game => 
        game.status.type.state === 'in'
      );
      
      if (hasLiveGames || games.length === 0) {
        fetchGames();
      }
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(interval);
  }, [fetchGames, games]);

  const liveGames = games.filter(game => game.status.type.state === 'in');
  const upcomingGames = games.filter(game => game.status.type.state === 'pre');
  const completedGames = games.filter(game => game.status.type.state === 'post');

  return {
    games,
    liveGames,
    upcomingGames,
    completedGames,
    loading,
    error,
    lastUpdated,
    refresh: fetchGames
  };
}