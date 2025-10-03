import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer } from '@phosphor-icons/react';
import { Game } from '@/types/sports';
import { 
  getTeamScore, 
  formatTimeRemaining, 
  formatDownAndDistance, 
  getGameStatusText, 
  getGameStatusColor 
} from '@/lib/sports-utils';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const competition = game.competitions[0];
  const [team1, team2] = competition.competitors;
  const situation = competition.situation;
  const status = game.status;
  
  const isLive = status.type.state === 'in';
  const isUpcoming = status.type.state === 'pre';
  const isCompleted = status.type.state === 'post';

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`${getGameStatusColor(status)} text-white font-medium`}
          >
            {isLive && <Timer className="w-3 h-3 mr-1" />}
            {isUpcoming && <Clock className="w-3 h-3 mr-1" />}
            {getGameStatusText(status)}
          </Badge>
          
          {isLive && situation?.lastPlay && (
            <div className="text-xs text-muted-foreground max-w-32 truncate">
              {formatDownAndDistance(situation.down, situation.distance)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={team1.team.logo} 
                alt={team1.team.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <div className="font-semibold text-lg">
                  {team1.team.abbreviation}
                </div>
                <div className="text-sm text-muted-foreground">
                  {team1.team.displayName}
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
              <img 
                src={team2.team.logo} 
                alt={team2.team.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <div className="font-semibold text-lg">
                  {team2.team.abbreviation}
                </div>
                <div className="text-sm text-muted-foreground">
                  {team2.team.displayName}
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

        {/* Game Details */}
        {isLive && situation?.lastPlay && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm">
              <div className="font-medium mb-1">Last Play:</div>
              <div className="text-muted-foreground text-xs leading-relaxed">
                {situation.lastPlay.text}
              </div>
            </div>
          </div>
        )}

        {isUpcoming && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-center text-muted-foreground">
              {new Date(game.date).toLocaleDateString([], {
                weekday: 'short',
                month: 'short', 
                day: 'numeric'
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}