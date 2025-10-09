import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer } from '@phosphor-icons/react';
import { Game } from '@/types/sports';
import { getTeamScore, getGameStatusText, getGameStatusColor, formatSituation } from '@/lib/sports-utils';

interface SimpleGameCardProps {
  game: Game;
}

export function SimpleGameCard({ game }: SimpleGameCardProps) {
  const competition = game.competitions?.[0];
  
  if (!competition) {
    return (
      <Card className="p-4 border-2 border-red-500">
        <div className="text-red-600 font-bold">No Competition Data</div>
        <div className="text-sm">Game ID: {game.id}</div>
      </Card>
    );
  }
  
  const competitors = competition.competitors || [];
  
  if (competitors.length < 2) {
    return (
      <Card className="p-4 border-2 border-orange-500">
        <div className="text-orange-600 font-bold">Missing Team Data</div>
        <div className="text-sm">Competitors: {competitors.length}</div>
        <div className="text-xs">{JSON.stringify(competitors, null, 2)}</div>
      </Card>
    );
  }
  
  const [team1, team2] = competitors;
  const status = game.status;
  const isLive = status.type.state === 'in';
  const isUpcoming = status.type.state === 'pre';
  const situation = competition.situation;
  
  return (
    <Card className="p-4 bg-white border-2 border-green-500">
      {/* Status */}
      <div className="mb-4">
        <Badge className={`${getGameStatusColor(status)} text-white font-bold text-lg px-3 py-1`}>
          {isLive && <Timer className="w-4 h-4 mr-1" />}
          {isUpcoming && <Clock className="w-4 h-4 mr-1" />}
          {getGameStatusText(status)}
        </Badge>
      </div>
      
      {/* Teams */}
      <div className="space-y-4">
        {/* Team 1 */}
        <div className="bg-blue-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {team1?.team?.logo && (
                <img 
                  src={team1.team.logo} 
                  alt={team1.team.name || 'Team'}
                  className="w-12 h-12 object-contain border border-gray-300 rounded"
                />
              )}
              <div>
                <div className="text-2xl font-black text-blue-900">
                  {team1?.team?.abbreviation || 'NO_ABB'}
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {team1?.team?.displayName || 'NO_DISPLAY_NAME'}
                </div>
                <div className="text-sm text-blue-600">
                  Name: {team1?.team?.name || 'NO_NAME'}
                </div>
              </div>
            </div>
            <div className="text-5xl font-black text-blue-900">
              {getTeamScore(team1)}
            </div>
          </div>
        </div>
        
        {/* Team 2 */}
        <div className="bg-red-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {team2?.team?.logo && (
                <img 
                  src={team2.team.logo} 
                  alt={team2.team.name || 'Team'}
                  className="w-12 h-12 object-contain border border-gray-300 rounded"
                />
              )}
              <div>
                <div className="text-2xl font-black text-red-900">
                  {team2?.team?.abbreviation || 'NO_ABB'}
                </div>
                <div className="text-lg font-bold text-red-700">
                  {team2?.team?.displayName || 'NO_DISPLAY_NAME'}
                </div>
                <div className="text-sm text-red-600">
                  Name: {team2?.team?.name || 'NO_NAME'}
                </div>
              </div>
            </div>
            <div className="text-5xl font-black text-red-900">
              {getTeamScore(team2)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Info */}
      {isLive && situation?.down && (
        <div className="mt-3 text-sm text-muted-foreground">
          {formatSituation(situation?.down, situation?.distance, situation?.yardLine, situation?.lastPlay?.text, 100)}
        </div>
      )}
      <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
        <div>Game ID: {game.id}</div>
        <div>League: {game.league}</div>
        <div>Date: {game.date}</div>
        <div>Competitors Count: {competitors.length}</div>
      </div>
    </Card>
  );
}