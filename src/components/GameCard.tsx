import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, FlipHorizontal, ArrowLeft, MapPin, Users } from '@phosphor-icons/react';
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
  
  const isLive = status.type.state === 'in';
  const isUpcoming = status.type.state === 'pre';
  const isCompleted = status.type.state === 'post';

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card 
      className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0 transition-transform duration-500 preserve-3d">
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'rotate-y-180' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
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

            <div className="space-y-4">
              {/* Team 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {team1?.team?.logo && (
                    <img 
                      src={team1.team.logo} 
                      alt={team1.team.name || 'Team'}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-semibold text-lg">
                      {team1?.team?.abbreviation || 'TBD'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {team1?.team?.displayName || 'Team Name TBD'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {getTeamScore(team1)}
                  </div>
                  {isLive && (
                    <div className="text-xs text-muted-foreground">
                      TO: {team1.timeouts || 0}
                    </div>
                  )}
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {team2?.team?.logo && (
                    <img 
                      src={team2.team.logo} 
                      alt={team2.team.name || 'Team'}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-semibold text-lg">
                      {team2?.team?.abbreviation || 'TBD'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {team2?.team?.displayName || 'Team Name TBD'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {getTeamScore(team2)}
                  </div>
                  {isLive && (
                    <div className="text-xs text-muted-foreground">
                      TO: {team2.timeouts || 0}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Game Info */}
            {isLive && situation?.lastPlay && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <div className="font-medium mb-1">Last Play:</div>
                  <div className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                    {situation.lastPlay.text}
                  </div>
                </div>
              </div>
            )}

            {isUpcoming && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-center text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {formatGameDate(game.date)}
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-center text-muted-foreground">
                  {formatGameDateShort(game.date)}
                </div>
              </div>
            )}
          </CardContent>
        </div>

        {/* Back Side */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'rotate-y-0' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Game Details</span>
              </div>
              <Badge 
                className={`${getGameStatusColor(status)} text-white font-medium`}
              >
                {getGameStatusText(status)}
              </Badge>
            </div>

            {/* Detailed Team Info */}
            <div className="space-y-3 mb-4">
              {[team1, team2].map((team, index) => (
                <div key={team?.id || index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {team?.team?.logo && (
                      <img 
                        src={team.team.logo} 
                        alt={team.team.name || 'Team'}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-sm">
                        {team?.team?.abbreviation || 'TBD'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Record: {team?.records?.[0]?.summary || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {getTeamScore(team)}
                    </div>
                    {isLive && (
                      <div className="text-xs text-muted-foreground">
                        TO: {team?.timeouts || 0}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Game Situation Details */}
            {isLive && situation && (
              <div className="space-y-3">
                {situation.down && situation.distance && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Down & Distance:</span>
                    <span className="font-medium">{formatDownAndDistance(situation.down, situation.distance)}</span>
                  </div>
                )}
                
                {situation.yardLine && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Field Position:</span>
                    <span className="font-medium">{situation.yardLine} yard line</span>
                  </div>
                )}

                {situation.possession && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Possession:</span>
                    <span className="font-medium">{situation.possession}</span>
                  </div>
                )}

                {situation.lastPlay && (
                  <div className="mt-4 pt-3 border-t">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Last Play:</div>
                      <div className="text-muted-foreground text-xs leading-relaxed">
                        {situation.lastPlay.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Game Details */}
            {isUpcoming && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Kickoff:
                  </span>
                  <span className="font-medium">{formatGameDate(game.date)}</span>
                </div>
                
                {competition.venue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Venue:
                    </span>
                    <span className="font-medium text-right">{competition.venue.fullName}</span>
                  </div>
                )}

                {competition.broadcasts && competition.broadcasts.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="font-medium">{competition.broadcasts[0].names?.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Completed Game Details */}
            {isCompleted && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Final Score:</span>
                  <span className="font-medium">
                    {team1?.team?.abbreviation || 'TBD'} {getTeamScore(team1)} - {getTeamScore(team2)} {team2?.team?.abbreviation || 'TBD'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatGameDate(game.date)}</span>
                </div>

                {competition.venue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Venue:
                    </span>
                    <span className="font-medium text-right">{competition.venue.fullName}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}