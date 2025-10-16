import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Timer, FlipHorizontal, MapPin, Television, TrendUp, ArrowsOut, User, ChartBar, ListDashes } from '@phosphor-icons/react';
import { Game } from '@/types/sports';
import { 
  getTeamScore, 
  formatTimeRemaining, 
  formatDownAndDistance, 
  formatSituation,
  getGameStatusText, 
  getGameStatusColor,
  formatGameDate,
  formatGameDateShort
} from '@/lib/sports-utils';
import { FullscreenGameOverlay } from '@/components/FullscreenGameOverlay';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
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
  const leaders = competition.leaders;
  const statistics = competition.statistics;
  const drives = competition.drives;
  
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
                className={`${getGameStatusColor(status)} text-white font-medium ${
                  isCompleted ? 'text-base px-3 py-1.5' : ''
                }`}
              >
                {isLive && <Timer className="w-3 h-3 mr-1" />}
                {isUpcoming && <Clock className="w-3 h-3 mr-1" />}
                {isCompleted && <span className="mr-1">🏁</span>}
                {getGameStatusText(status)}
              </Badge>
              
              <div className="flex items-center space-x-2">
                {isLive && situation?.down && (
                  <div className="text-xs text-muted-foreground">
                    {formatSituation(
                      situation?.down,
                      situation?.distance,
                      situation?.yardLine,
                      situation?.lastPlay?.text
                    )}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullscreen(true);
                  }}
                  aria-label="Open fullscreen view"
                >
                  <ArrowsOut className="w-4 h-4" />
                </Button>
                <FlipHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Teams vs Format */}
            <div className="space-y-4 flex-1">
              {/* Team 1 */}
              <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                team1IsWinner ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-500 dark:border-green-700 shadow-md' : ''
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
                    <div className="flex items-center gap-2">
                      <div className={`font-bold text-xl ${team1IsWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
                        {team1?.team?.abbreviation || 'TBD'}
                      </div>
                      {team1IsWinner && <span className="text-lg">👑</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {team1?.team?.displayName || 'Team Name TBD'}
                    </div>
                    {team1?.records?.[0]?.summary && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {team1.records[0].summary}
                      </div>
                    )}
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
                team2IsWinner ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-500 dark:border-green-700 shadow-md' : ''
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
                    <div className="flex items-center gap-2">
                      <div className={`font-bold text-xl ${team2IsWinner ? 'text-green-700 dark:text-green-400' : ''}`}>
                        {team2?.team?.abbreviation || 'TBD'}
                      </div>
                      {team2IsWinner && <span className="text-lg">👑</span>}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {team2?.team?.displayName || 'Team Name TBD'}
                    </div>
                    {team2?.records?.[0]?.summary && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {team2.records[0].summary}
                      </div>
                    )}
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
                <div className="space-y-2">
                  <div className="text-sm text-center text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatGameDate(game.date)}
                  </div>
                  {broadcasts && broadcasts.length > 0 && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Television className="w-3 h-3" />
                      <span>{broadcasts.map(b => b.names?.join(', ')).join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="text-sm text-center">
                  <div className="font-bold text-base text-foreground mb-1">
                    🏁 FINAL
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {formatGameDateShort(game.date)}
                  </div>
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
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowsOut className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="fixed inset-0 w-screen h-screen overflow-y-auto bg-background p-8 rounded-none border-0 shadow-none" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle className="text-3xl">
                        {team1?.team?.displayName} vs {team2?.team?.displayName}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-8 py-6">
                      {/* Large Score Display */}
                      <div className="flex items-center justify-around py-6 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          {team1?.team?.logo && (
                            <img 
                              src={team1.team.logo} 
                              alt={team1.team.name || 'Team'}
                              className="w-32 h-32 object-contain mx-auto mb-4"
                            />
                          )}
                          <div className={`text-6xl font-bold mb-2 ${team1IsWinner ? 'text-green-600' : 'text-primary'}`}>
                            {getTeamScore(team1)}
                          </div>
                          <div className="text-xl font-semibold">{team1?.team?.abbreviation}</div>
                          <div className="text-sm text-muted-foreground">{team1?.records?.[0]?.summary}</div>
                        </div>
                        
                        <div className="text-4xl font-bold text-muted-foreground">VS</div>
                        
                        <div className="text-center">
                          {team2?.team?.logo && (
                            <img 
                              src={team2.team.logo} 
                              alt={team2.team.name || 'Team'}
                              className="w-32 h-32 object-contain mx-auto mb-4"
                            />
                          )}
                          <div className={`text-6xl font-bold mb-2 ${team2IsWinner ? 'text-green-600' : 'text-primary'}`}>
                            {getTeamScore(team2)}
                          </div>
                          <div className="text-xl font-semibold">{team2?.team?.abbreviation}</div>
                          <div className="text-sm text-muted-foreground">{team2?.records?.[0]?.summary}</div>
                        </div>
                      </div>

                      {/* Game Status */}
                      <div className="text-center">
                        <Badge className={`${getGameStatusColor(status)} text-white font-medium text-lg px-4 py-2`}>
                          {isLive && <Timer className="w-4 h-4 mr-2" />}
                          {isUpcoming && <Clock className="w-4 h-4 mr-2" />}
                          {isCompleted && <span className="mr-2">🏁</span>}
                          {getGameStatusText(status)}
                        </Badge>
                      </div>

                      {/* Venue & Broadcast */}
                      <div className="grid grid-cols-2 gap-4">
                        {venue && (
                          <div className="space-y-1 p-4 bg-muted/30 rounded-lg">
                            <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              Venue
                            </div>
                            <div className="font-medium">{venue.fullName}</div>
                            {venue.address && (
                              <div className="text-sm text-muted-foreground">
                                {venue.address.city}, {venue.address.state}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {broadcasts && broadcasts.length > 0 && (
                          <div className="space-y-1 p-4 bg-muted/30 rounded-lg">
                            <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                              <Television className="w-4 h-4 mr-1" />
                              Broadcast
                            </div>
                            <div className="font-medium">{broadcasts.map(b => b.names?.join(', ')).join(', ')}</div>
                          </div>
                        )}
                      </div>

                      {/* Betting Odds */}
                      {odds && (
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                          <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                            <TrendUp className="w-4 h-4 mr-1" />
                            Betting Lines {odds.provider && `via ${odds.provider.name}`}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {odds.spread !== undefined && (
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Spread</div>
                                <div className="font-semibold">
                                  {odds.awayTeamOdds?.favorite ? team1?.team?.abbreviation : team2?.team?.abbreviation} {Math.abs(odds.spread) > 0 ? odds.spread : 'PK'}
                                </div>
                              </div>
                            )}
                            
                            {odds.overUnder !== undefined && (
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Over/Under</div>
                                <div className="font-semibold">{odds.overUnder}</div>
                              </div>
                            )}
                            
                            {(odds.homeTeamOdds?.moneyLine || odds.awayTeamOdds?.moneyLine) && (
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Money Line</div>
                                <div className="space-y-1 text-sm">
                                  {odds.awayTeamOdds?.moneyLine && (
                                    <div>{team1?.team?.abbreviation}: {odds.awayTeamOdds.moneyLine > 0 ? '+' : ''}{odds.awayTeamOdds.moneyLine}</div>
                                  )}
                                  {odds.homeTeamOdds?.moneyLine && (
                                    <div>{team2?.team?.abbreviation}: {odds.homeTeamOdds.moneyLine > 0 ? '+' : ''}{odds.homeTeamOdds.moneyLine}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Game Notes */}
                      {notes && notes.length > 0 && (
                        <div className="space-y-2">
                          <div className="font-semibold text-muted-foreground uppercase text-xs">Game Notes</div>
                          {notes.map((note, idx) => (
                            <div key={idx} className="text-sm leading-relaxed bg-muted/50 p-3 rounded">
                              {note.headline}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Last Play (if live) */}
                      {isLive && situation?.lastPlay && (
                        <div className="space-y-2">
                          <div className="font-semibold text-muted-foreground uppercase text-xs">Last Play</div>
                          <div className="text-sm leading-relaxed bg-muted/50 p-3 rounded">
                            {situation.lastPlay.text}
                          </div>
                        </div>
                      )}

                      {/* Team Statistics */}
                      {statistics && (isLive || isCompleted) && (
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                          <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                            <ChartBar className="w-4 h-4 mr-1" />
                            Team Statistics
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            {/* Team 1 Stats */}
                            <div className="space-y-2">
                              <div className="font-semibold text-sm mb-3">{team1?.team?.abbreviation}</div>
                              {statistics['team-1']?.map((stat, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{stat.name}</span>
                                  <span className="font-medium">{stat.displayValue}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Team 2 Stats */}
                            <div className="space-y-2">
                              <div className="font-semibold text-sm mb-3">{team2?.team?.abbreviation}</div>
                              {statistics['team-2']?.map((stat, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{stat.name}</span>
                                  <span className="font-medium">{stat.displayValue}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Play-by-Play Timeline */}
                      {drives && drives.length > 0 && (isLive || isCompleted) && (
                        <div className="space-y-4">
                          <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                            <ListDashes className="w-4 h-4 mr-1" />
                            Play-by-Play
                          </div>
                          
                          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {drives.map((drive) => (
                              <div key={drive.id} className="border-l-2 border-muted pl-4 space-y-2">
                                {/* Drive Header */}
                                <div className="flex items-start justify-between gap-2 sticky top-0 bg-background py-1">
                                  <div className="font-semibold text-sm">
                                    {drive.team.abbreviation} - {drive.description}
                                  </div>
                                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    Q{drive.start.period.number} {drive.start.clock.displayValue}
                                  </div>
                                </div>
                                
                                {/* Drive Result */}
                                {drive.result && (
                                  <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                                    drive.result === 'Touchdown' 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                      : drive.result === 'Field Goal'
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {drive.result}
                                  </div>
                                )}
                                
                                {/* Plays */}
                                <div className="space-y-1.5">
                                  {drive.plays.map((play) => (
                                    <div 
                                      key={play.id} 
                                      className={`text-xs p-2 rounded ${
                                        play.scoringPlay 
                                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                                          : 'bg-muted/30'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <span className="font-medium text-muted-foreground">
                                            {play.type.text}:
                                          </span>{' '}
                                          <span className={play.scoringPlay ? 'font-semibold' : ''}>
                                            {play.text}
                                          </span>
                                        </div>
                                        <div className="text-muted-foreground whitespace-nowrap text-[10px]">
                                          {play.clock.displayValue}
                                        </div>
                                      </div>
                                      {play.scoringPlay && (
                                        <div className="mt-1 text-[10px] font-semibold text-green-600 dark:text-green-400">
                                          {/* awayScore = first team (team1), homeScore = second team (team2) */}
                                          Score: {play.awayScore} - {play.homeScore}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <FlipHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
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

              {/* Player Leaders */}
              {leaders && leaders.length > 0 && (isLive || isCompleted) && (
                <div className="space-y-3 border-t pt-3">
                  <div className="font-semibold text-muted-foreground uppercase text-xs flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Player Leaders
                  </div>
                  
                  {leaders.map((teamLeaders, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="font-medium text-xs text-muted-foreground">
                        {idx === 0 ? team1?.team?.abbreviation : team2?.team?.abbreviation}
                      </div>
                      
                      {teamLeaders.passing && (
                        <div className="flex items-center gap-2 text-xs bg-muted/30 p-2 rounded">
                          <div className="flex items-center gap-2 flex-1">
                            {teamLeaders.passing.headshot && (
                              <img 
                                src={teamLeaders.passing.headshot} 
                                alt={teamLeaders.passing.name}
                                className="w-8 h-8 rounded-full object-cover bg-muted"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <div className="font-medium">{teamLeaders.passing.name}</div>
                              <div className="text-muted-foreground text-xs">{teamLeaders.passing.position}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-medium">
                            {teamLeaders.passing.stats}
                          </div>
                        </div>
                      )}
                      
                      {teamLeaders.rushing && (
                        <div className="flex items-center gap-2 text-xs bg-muted/30 p-2 rounded">
                          <div className="flex items-center gap-2 flex-1">
                            {teamLeaders.rushing.headshot && (
                              <img 
                                src={teamLeaders.rushing.headshot} 
                                alt={teamLeaders.rushing.name}
                                className="w-8 h-8 rounded-full object-cover bg-muted"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <div className="font-medium">{teamLeaders.rushing.name}</div>
                              <div className="text-muted-foreground text-xs">{teamLeaders.rushing.position}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-medium">
                            {teamLeaders.rushing.stats}
                          </div>
                        </div>
                      )}
                      
                      {teamLeaders.receiving && (
                        <div className="flex items-center gap-2 text-xs bg-muted/30 p-2 rounded">
                          <div className="flex items-center gap-2 flex-1">
                            {teamLeaders.receiving.headshot && (
                              <img 
                                src={teamLeaders.receiving.headshot} 
                                alt={teamLeaders.receiving.name}
                                className="w-8 h-8 rounded-full object-cover bg-muted"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <div className="font-medium">{teamLeaders.receiving.name}</div>
                              <div className="text-muted-foreground text-xs">{teamLeaders.receiving.position}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-medium">
                            {teamLeaders.receiving.stats}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

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
      
      {/* Fullscreen Overlay */}
      {showFullscreen && (
        <FullscreenGameOverlay 
          game={game} 
          onClose={() => setShowFullscreen(false)} 
        />
      )}
    </div>
  );
}