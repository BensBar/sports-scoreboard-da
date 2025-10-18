import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowClockwise, Football, Broadcast } from '@phosphor-icons/react';
import { GameCard } from '@/components/GameCard';
import { useSportsData } from '@/hooks/use-sports-data';
import { useKV } from '@github/spark/hooks';
import { League } from '@/types/sports';
import { toast } from 'sonner';

export function SportsDashboard() {
  const [selectedLeague, setSelectedLeague] = useKV<League>('selected-league', 'nfl');
  const [showTop25Only, setShowTop25Only] = useState(false);
  const currentLeague = selectedLeague || 'nfl';
  
  const { 
    liveGames, 
    upcomingGames, 
    completedGames, 
    loading, 
    error, 
    lastUpdated, 
    refresh 
  } = useSportsData(currentLeague);

  // Filter function for Top 25 teams
  const filterTop25 = (games: typeof liveGames) => {
    if (!showTop25Only || currentLeague !== 'college-football') {
      return games;
    }
    return games.filter(game => {
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

  const filteredLiveGames = filterTop25(liveGames);
  const filteredUpcomingGames = filterTop25(upcomingGames);
  const filteredCompletedGames = filterTop25(completedGames);

  const handleLeagueChange = (league: League) => {
    setSelectedLeague(league);
    setShowTop25Only(false); // Reset filter when changing leagues
    toast.success(`Switched to ${league.toUpperCase()}`);
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
            {/* League Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={currentLeague === 'nfl' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLeagueChange('nfl')}
                className="text-sm font-medium"
              >
                <Football className="w-4 h-4 mr-1" />
                NFL
              </Button>
              <Button
                variant={currentLeague === 'college-football' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleLeagueChange('college-football')}
                className="text-sm font-medium"
              >
                <Football className="w-4 h-4 mr-1" />
                NCAAF
              </Button>
            </div>

            {/* Top 25 Filter (only for NCAA) */}
            {currentLeague === 'college-football' && (
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
        {filteredLiveGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">Live Games</h2>
              <Badge className="bg-primary text-primary-foreground">
                {filteredLiveGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLiveGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Games */}
        {filteredCompletedGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">Final Scores</h2>
              <Badge variant="secondary">
                {filteredCompletedGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompletedGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Games */}
        {filteredUpcomingGames.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-2xl font-semibold">Upcoming Games</h2>
              <Badge variant="outline">
                {filteredUpcomingGames.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUpcomingGames.map((game) => (
                <GameCard key={game.id} game={game} onRefresh={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && liveGames.length === 0 && upcomingGames.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* No Games State */}
        {!loading && filteredLiveGames.length === 0 && filteredUpcomingGames.length === 0 && filteredCompletedGames.length === 0 && (
          <div className="text-center py-12">
            <Football className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {showTop25Only ? 'No Top 25 Games' : 'No Games Today'}
            </h3>
            <p className="text-muted-foreground">
              {showTop25Only 
                ? 'No Top 25 ranked teams are playing right now'
                : `Check back later for upcoming ${currentLeague.toUpperCase()} games`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}