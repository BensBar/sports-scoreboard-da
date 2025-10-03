import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, FlipHorizontal, MapPin, Television, TrendUp } from '@phosphor-icons/react';
import { Game } from '@/types/sports';
import { 
  getTeamScore, 
  formatTimeRemaining, 
  formatDownAndDistance, 
  getGameStatusText, 
  getGameStatusColor,
  formatGameDate,
  formatGameDateShort
} from '@/lib/sports-utils';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const competition = game.competitions?.[0];
  if (!competition) {
    return (
      <Card className="w-full max-w-md p-6">
        <div className="text-center text-muted-foreground">
          No game data available
        </div>
      </Card>
    );
  }
  
  const competitors = competition.competitors || [];
  if (competitors.length < 2) {
    return (
      <Card className="w-full max-w-md p-6">
        <div className="text-center text-muted-foreground">
          Incomplete team data
        </div>
      </Card>
    );
  }
  
  const [team1, team2] = competitors;
  const situation = competition.situation;
  const status = game.status;
  const venue = competition.venue;
  const broadcasts = competition.broadcasts;
  const odds = competition.odds?.[0];
  const notes = competition.notes;
  
  const isLive = status.type.state === 'in';
  const isUpcoming = status.type.state === 'pre';
  const isCompleted = status.type.state === 'post';

  // Determine winner for completed games
  const team1Score = getTeamScore(team1);
  const team2Score = getTeamScore(team2);
  const team1IsWinner = isCompleted && team1Score > team2Score;
  const team2IsWinner = isCompleted && team2Score > team1Score;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md h-[400px]" style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full h-full transition-transform duration-500 cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={handleCardClick}
      >
        {/* Front of Card */}
        <Card 
          className="absolute w-full h-full hover:shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <CardContent className="p-6 h-full flex flex-col">
            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <Badge 
                className={`${getGameStatusColor(status)} text-white font-medium`}
              >
                {isLive && <Timer className="w-3 h-3 mr-1" />}
                {isUpcoming && <Clock className="w-3 h-3 mr-1" />}
                {getGameStatusText(status)}
              </Badge>
              
              <div className="flex items-center space-x-2">
                {isLive && situation?.down && situation?.distance && (
                  <div className="text-xs text-muted-foreground">
                    {formatDownAndDistance(situation.down, situation.distance)}
                  </div>
                )}
                <FlipHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Teams vs Format */}
            <div className="space-y-4 flex-1">
              {/* Team 1 */}
              <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                team1IsWinner ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-500 dark:border-green-700' : ''
              }`}>
                <div className="flex items-center space-x-3 flex-1">
                  {team1?.team?.logo && (
                    <img 
                      src={team1.team.logo} 
                      alt={team1.team.name || 'Team'}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className={`font-bold text-xl ${team1IsWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
                      {team1?.team?.abbreviation || 'TBD'}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {team1?.team?.displayName || 'Team Name TBD'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`text-3xl font-bold ${team1IsWinner ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                    {getTeamScore(team1)}
                  </div>
                </div>
              </div>

              {/* VS Divider */}
              <div className="text-center text-muted-foreground font-medium">
                VS
              </div>

              {/* Team 2 */}
              <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                team2IsWinner ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-500 dark:border-green-700' : ''
              }`}>
                <div className="flex items-center space-x-3 flex-1">
                  {team2?.team?.logo && (
                    <img 
                      src={team2.team.logo} 
                      alt={team2.team.name || 'Team'}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className={`font-bold text-xl ${team2IsWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
                      {team2?.team?.abbreviation || 'TBD'}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {team2?.team?.displayName || 'Team Name TBD'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`text-3xl font-bold ${team2IsWinner ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                    {getTeamScore(team2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Details Footer */}
            <div className="mt-6 pt-4 border-t">
              {isLive && situation?.lastPlay && (
                <div className="text-sm">
                  <div className="font-medium mb-1">Last Play:</div>
                  <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                    {situation.lastPlay.text}
                  </div>
                </div>
              )}

              {isUpcoming && (
                <div className="text-sm text-center text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {formatGameDate(game.date)}
                </div>
              )}

              {isCompleted && (
                <div className="text-sm text-center text-muted-foreground">
                  Final - {formatGameDateShort(game.date)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card 
          className="absolute w-full h-full hover:shadow-lg"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardContent className="p-6 h-full flex flex-col overflow-y-auto">
            {/* Back Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Game Details</h3>
              <FlipHorizontal className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-4 text-sm flex-1">
              {/* Team Records */}
              <div className="space-y-2">
                <div className="font-semibold text-muted-foreground uppercase text-xs">Team Records</div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{team1?.team?.abbreviation}</span>
                  <span className="text-muted-foreground">
                    {team1?.records?.[0]?.summary || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{team2?.team?.abbreviation}</span>
                  <span className="text-muted-foreground">
                    {team2?.records?.[0]?.summary || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Venue */}
              {venue && (
                <div className="space-y-1">
                  <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Venue
                  </div>
                  <div>{venue.fullName}</div>
                  {venue.address && (
                    <div className="text-muted-foreground text-xs">
                      {venue.address.city}, {venue.address.state}
                    </div>
                  )}
                </div>
              )}

              {/* Broadcast */}
              {broadcasts && broadcasts.length > 0 && (
                <div className="space-y-1">
                  <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                    <Television className="w-3 h-3 mr-1" />
                    Broadcast
                  </div>
                  <div>{broadcasts.map(b => b.names?.join(', ')).join(', ')}</div>
                </div>
              )}

              {/* Betting Odds */}
              {odds && (
                <div className="space-y-2 border-t pt-3">
                  <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                    <TrendUp className="w-3 h-3 mr-1" />
                    Betting Lines
                  </div>
                  {odds.provider && (
                    <div className="text-xs text-muted-foreground mb-2">
                      via {odds.provider.name}
                    </div>
                  )}
                  
                  {/* Spread */}
                  {odds.spread !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Spread:</span>
                      <span className="font-medium">
                        {odds.awayTeamOdds?.favorite ? team1?.team?.abbreviation : team2?.team?.abbreviation} {Math.abs(odds.spread) > 0 ? odds.spread : 'PK'}
                      </span>
                    </div>
                  )}

                  {/* Over/Under */}
                  {odds.overUnder !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Over/Under:</span>
                      <span className="font-medium">{odds.overUnder}</span>
                    </div>
                  )}

                  {/* Money Lines */}
                  {(odds.homeTeamOdds?.moneyLine || odds.awayTeamOdds?.moneyLine) && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Money Line:</div>
                      {odds.awayTeamOdds?.moneyLine && (
                        <div className="flex justify-between">
                          <span>{team1?.team?.abbreviation}</span>
                          <span className="font-medium">
                            {odds.awayTeamOdds.moneyLine > 0 ? '+' : ''}{odds.awayTeamOdds.moneyLine}
                          </span>
                        </div>
                      )}
                      {odds.homeTeamOdds?.moneyLine && (
                        <div className="flex justify-between">
                          <span>{team2?.team?.abbreviation}</span>
                          <span className="font-medium">
                            {odds.homeTeamOdds.moneyLine > 0 ? '+' : ''}{odds.homeTeamOdds.moneyLine}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* News/Notes */}
              {notes && notes.length > 0 && (
                <div className="space-y-2 border-t pt-3">
                  <div className="font-semibold text-muted-foreground uppercase text-xs">
                    Game Notes
                  </div>
                  {notes.map((note, idx) => (
                    <div key={idx} className="text-xs leading-relaxed bg-muted/50 p-2 rounded">
                      {note.headline}
                    </div>
                  ))}
                </div>
              )}

              {!odds && !notes?.length && (
                <div className="text-center text-muted-foreground text-xs py-4">
                  No additional betting or news information available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}