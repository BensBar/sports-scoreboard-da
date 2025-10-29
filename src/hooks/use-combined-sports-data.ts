import { useState, useEffect, useCallback } from 'react';
import { Game, League } from '@/types/sports';
import { useSportsData } from './use-sports-data';

export type ViewMode = 'live' | 'all' | 'nfl' | 'ncaaf';

export function useCombinedSportsData() {
  const nflData = useSportsData('nfl');
  const ncaafData = useSportsData('college-football');
  
  const [viewMode, setViewMode] = useState<ViewMode>('live');

  // Determine if there are any live games across both leagues
  const hasLiveGames = nflData.liveGames.length > 0 || ncaafData.liveGames.length > 0;

  // Auto-switch to 'live' view when live games are detected
  useEffect(() => {
    if (hasLiveGames && viewMode !== 'live') {
      // Only auto-switch if we're not explicitly viewing a specific league
      if (viewMode === 'all') {
        setViewMode('live');
      }
    }
  }, [hasLiveGames, viewMode]);

  // Combine data based on current view mode
  const getFilteredData = useCallback(() => {
    switch (viewMode) {
      case 'live':
        // Show all live games from both leagues
        return {
          liveGames: [...nflData.liveGames, ...ncaafData.liveGames],
          upcomingGames: [],
          completedGames: [],
        };
      
      case 'nfl':
        // Show only NFL games
        return {
          liveGames: nflData.liveGames,
          upcomingGames: nflData.upcomingGames,
          completedGames: nflData.completedGames,
        };
      
      case 'ncaaf':
        // Show only NCAA games
        return {
          liveGames: ncaafData.liveGames,
          upcomingGames: ncaafData.upcomingGames,
          completedGames: ncaafData.completedGames,
        };
      
      case 'all':
        // Show all games from both leagues
        return {
          liveGames: [...nflData.liveGames, ...ncaafData.liveGames],
          upcomingGames: [...nflData.upcomingGames, ...ncaafData.upcomingGames],
          completedGames: [...nflData.completedGames, ...ncaafData.completedGames],
        };
      
      default:
        return {
          liveGames: [],
          upcomingGames: [],
          completedGames: [],
        };
    }
  }, [viewMode, nflData, ncaafData]);

  const filteredData = getFilteredData();

  const refresh = useCallback(() => {
    nflData.refresh();
    ncaafData.refresh();
  }, [nflData.refresh, ncaafData.refresh]);

  const loading = nflData.loading || ncaafData.loading;
  const error = nflData.error || ncaafData.error;
  const lastUpdated = nflData.lastUpdated && ncaafData.lastUpdated
    ? new Date(Math.max(nflData.lastUpdated.getTime(), ncaafData.lastUpdated.getTime()))
    : nflData.lastUpdated || ncaafData.lastUpdated;

  return {
    ...filteredData,
    viewMode,
    setViewMode,
    hasLiveGames,
    loading,
    error,
    lastUpdated,
    refresh,
    // Expose individual league data counts for UI display
    counts: {
      nfl: {
        live: nflData.liveGames.length,
        completed: nflData.completedGames.length,
        upcoming: nflData.upcomingGames.length,
      },
      ncaaf: {
        live: ncaafData.liveGames.length,
        completed: ncaafData.completedGames.length,
        upcoming: ncaafData.upcomingGames.length,
      },
    },
  };
}
