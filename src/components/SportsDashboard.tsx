import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowClockwise, Football, Broadcast, FunnelSimple } from '@phosphor-icons/react';
import { GameCard } from '@/components/GameCard';
import { useMultiLeagueData } from '@/hooks/use-multi-league-data';
import { useKV } from '@github/spark/hooks';
import { League, Game } from '@/types/sports';
import { toast } from 'sonner';

type ViewMode = 'live' | 'past';
type LeagueFilter = 'all' | 'nfl' | 'college-football';

export function SportsDashboard() {
  const [viewMode, setViewMode] = useKV<ViewMode>('view-mode', 'live');
  const [leagueFilter, setLeagueFilter] = useKV<LeagueFilter>('league-filter', 'all');
  const [showTop25Only, setShowTop25Only] = useState(false);
  
  const { 
    liveGames, 
    upcomingGames, 
    completedGames, 
    loading, 
    error, 
    lastUpdated, 
    refresh 
  } = useMultiLeagueData();

  // Apply league filter
  const applyLeagueFilter = (games: Game[]) => {
    if (leagueFilter === 'all') return games;
    return games.filter(game => game.league === leagueFilter);
  };

  // Filter function for Top 25 teams (only for college football)
  const filterTop25 = (games: Game[]) => {
    if (!showTop25Only) {
      return games;
    }
    return games.filter(game => {
      if (game.league !== 'college-football') return true; // Don't filter NFL games
      const competition = game.competitions?.[0];
      if (!competition) return false;
      const competitors = competition.competitors || [];
      // Show game if either team is ranked in Top 25
      return competitors.some(team => 
        (team.curatedRank?.current && team.curatedRank.current <= 25) ||
        (team.rank && team.rank <= 25)
      );
    });
  };

  // Determine which games to show based on view mode
  const getDisplayGames = (): { live: Game[]; upcoming: Game[]; completed: Game[] } => {
    if (viewMode === 'live') {
      // Show all live games from both leagues
      return {
        live: filterTop25(liveGames),
        upcoming: [] as Game[],
        completed: [] as Game[]
      };
    } else {
      // Show filtered past games based on league selection
      const filtered = applyLeagueFilter(completedGames);
      return {
        live: [] as Game[],
        upcoming: [] as Game[],
        completed: filterTop25(filtered)
      };
    }
  };

  const { live: displayLiveGames, upcoming: displayUpcomingGames, completed: displayCompletedGames } = getDisplayGames();

  const handleLeagueFilterChange = (filter: LeagueFilter) => {
    setLeagueFilter(filter);
    toast.success(`Showing ${filter === 'all' ? 'all leagues' : filter.toUpperCase()} games`);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'live') {
      setLeagueFilter('all'); // Reset to all when viewing live
    }
    toast.success(`Switched to ${mode === 'live' ? 'live games' : 'past games'} view`);
  };

  const handleRefresh = () => {
    refresh();
    toast.success('Refreshing games...');
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Broadcast className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Sports Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <ArrowClockwise 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* View Mode and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'live' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('live')}
              className="text-sm font-medium"
              disabled={liveGames.length === 0}
            >
              <Broadcast className="w-4 h-4 mr-1" />
              Live Games
              {liveGames.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground" variant="secondary">
                  {liveGames.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={viewMode === 'past' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('past')}
              className="text-sm font-medium"
            >
              <FunnelSimple className="w-4 h-4 mr-1" />
              Past Games
            </Button>
          </div>

          {/* League Filter (only visible in past games mode) */}
          {viewMode === 'past' && (
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={leagueFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLeagueFilterChange('all')}
                className="text-sm font-medium"
              >
                All Leagues
              </Button>
              <Button
                variant={leagueFilter === 'nfl' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLeagueFilterChange('nfl')}
                className="text-sm font-medium"
              >
                <Football className="w-4 h-4 mr-1" />
                NFL
              </Button>
              <Button
                variant={leagueFilter === 'college-football' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLeagueFilterChange('college-football')}
                className="text-sm font-medium"
              >
                <Football className="w-4 h-4 mr-1" />
                NCAAF
              </Button>
            </div>
          )}

          {/* Top 25 Filter */}
          {(viewMode === 'live' || leagueFilter === 'college-football' || leagueFilter === 'all') && (
            <Button
              variant={showTop25Only ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setShowTop25Only(!showTop25Only);
                toast.success(showTop25Only ? 'Showing all games' : 'Showing Top 25 games');
              }}
              className="text-sm font-medium"
            >
              Top 25
            </Button>
          )}
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-sm text-muted-foreground mb-6">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="text-destructive text-sm font-medium mb-2">
              Error loading games: {error}
            </div>
            <div className="text-sm text-muted-foreground">
              Showing sample data instead. Real data will be available when the API is accessible.
            </div>
          </div>
        )}

        {/* Live Games */}
        {displayLiveGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">Live Games - All Leagues</h2>
              <Badge className="bg-primary text-primary-foreground">
                {displayLiveGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayLiveGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Games */}
        {displayCompletedGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">
                Final Scores
                {leagueFilter !== 'all' && ` - ${leagueFilter === 'nfl' ? 'NFL' : 'NCAA'}`}
              </h2>
              <Badge variant="secondary">
                {displayCompletedGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCompletedGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Games */}
        {displayUpcomingGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">Upcoming Games</h2>
              <Badge variant="outline">
                {displayUpcomingGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayUpcomingGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && displayLiveGames.length === 0 && displayUpcomingGames.length === 0 && displayCompletedGames.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* No Games State */}
        {!loading && displayLiveGames.length === 0 && displayUpcomingGames.length === 0 && displayCompletedGames.length === 0 && (
          <div className="text-center py-12">
            <Football className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {viewMode === 'live' 
                ? (showTop25Only ? 'No Live Top 25 Games' : 'No Live Games')
                : (showTop25Only ? 'No Top 25 Past Games' : 'No Past Games')
              }
            </h3>
            <p className="text-muted-foreground">
              {viewMode === 'live' 
                ? (showTop25Only 
                    ? 'No Top 25 ranked teams are playing right now' 
                    : 'No games are currently live. Check back later!'
                  )
                : (showTop25Only
                    ? `No Top 25 past games found for ${(leagueFilter || 'all') === 'all' ? 'any league' : (leagueFilter || 'all').toUpperCase()}`
                    : `No past games found for ${(leagueFilter || 'all') === 'all' ? 'any league' : (leagueFilter || 'all').toUpperCase()}`
                  )
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}