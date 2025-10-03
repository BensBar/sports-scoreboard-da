import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, FlipHorizontal, ArrowLeft, MapPin } from '@phosphor-icons/react';
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
      <CardContent className="p-6">
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
        <div className="space-y-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
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
                <div className="font-bold text-xl">
                  {team1?.team?.abbreviation || 'TBD'}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {team1?.team?.displayName || 'Team Name TBD'}
                </div>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-primary">
                {getTeamScore(team1)}
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="text-center text-muted-foreground font-medium">
            VS
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
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
                <div className="font-bold text-xl">
                  {team2?.team?.abbreviation || 'TBD'}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {team2?.team?.displayName || 'Team Name TBD'}
                </div>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-primary">
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
  );
}