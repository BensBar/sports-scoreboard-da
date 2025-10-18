import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Football, MapPin, Television, Trophy } from '@phosphor-icons/react';
import { Game, ESPNTeam } from '@/types/sports';
import { getTeamScore, formatDownAndDistance, formatGameDate, getLastNPlays, formatPlayInfo } from '@/lib/sports-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FullscreenGameOverlayProps {
  game: Game;
  onClose: () => void;
}

export function FullscreenGameOverlay({ game, onClose }: FullscreenGameOverlayProps) {
  const competition = game.competitions?.[0];
  
  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!competition || competition.competitors.length < 2) {
    return null;
  }

  const [team1, team2] = competition.competitors;
  const situation = competition.situation;
  const status = game.status;
  const venue = competition.venue;
  const broadcasts = competition.broadcasts;
  const odds = competition.odds?.[0];
  const leaders = competition.leaders;
  const notes = competition.notes;
  const drives = competition.drives;
  
  const team1Score = getTeamScore(team1);
  const team2Score = getTeamScore(team2);
  
  const isLive = status.type.state === 'in';
  const isUpcoming = status.type.state === 'pre';
  const isCompleted = status.type.state === 'post';
  
  // Determine possession
  const team1HasPossession = situation?.possession === team1.id;
  const team2HasPossession = situation?.possession === team2.id;
  
  // Format quarter
  const period = status.period || 1;
  const quarter = period === 1 ? 'Q1' : 
                 period === 2 ? 'Q2' : 
                 period === 3 ? 'Q3' : 
                 period === 4 ? 'Q4' : 
                 period === 5 ? 'OT' : `OT${period - 4}`;
  
  // Format down & distance with yard line
  const downDistanceText = formatDownAndDistance(situation?.down, situation?.distance);
  const yardLineText = situation?.yardLine ? ` at ${situation.yardLine}` : '';
  const situationText = downDistanceText ? `${downDistanceText}${yardLineText}` : '';

  // Get last 3 plays for live games
  const last3Plays = isLive ? getLastNPlays(drives, 3) : [];

  const overlayContent = (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col text-white overflow-y-auto"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 sticky top-0 bg-black/95 z-10">
        <div className="flex items-center gap-6 text-2xl font-bold">
          <span className="text-yellow-400">{quarter}</span>
          <span className="text-white/90">{status.displayClock || '0:00'}</span>
          {situationText && (
            <span className="text-white/70 text-xl">{situationText}</span>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 hover:bg-white/10 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-8 h-8" weight="bold" />
        </Button>
      </div>

      {/* Main Scoreboard Area */}
      <div 
        className="flex items-center justify-center px-8 py-12 min-h-[400px]"
        onClick={(e) => e.stopPropagation()}
        aria-live="polite"
        role="region"
        aria-label="Game scoreboard"
      >
        <div className="flex items-center gap-16 max-w-6xl w-full">
          {/* Team 1 Panel */}
          <TeamPanel 
            team={team1} 
            score={team1Score}
            hasPossession={team1HasPossession}
            timeouts={team1.timeouts}
          />
          
          {/* VS Divider */}
          <div className="text-4xl font-bold text-white/40">VS</div>
          
          {/* Team 2 Panel */}
          <TeamPanel 
            team={team2} 
            score={team2Score}
            hasPossession={team2HasPossession}
            timeouts={team2.timeouts}
          />
        </div>
      </div>

      {/* Last 3 Plays Section - Only for Live Games */}
      {isLive && last3Plays.length > 0 && (
        <div className="px-8 py-6 border-t border-white/10 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Football className="w-4 h-4" />
              Last {last3Plays.length} {last3Plays.length === 1 ? 'Play' : 'Plays'}
            </div>
            <div className="space-y-3">
              {last3Plays.map((play, idx) => (
                <div 
                  key={play.id} 
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Play Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Down & Distance */}
                      {play.start?.down && play.start?.distance !== undefined && (
                        <div className="text-xs text-white/60 mb-1 font-semibold">
                          {formatDownAndDistance(play.start.down, play.start.distance)}
                          {play.start.yardLine !== undefined && play.start.yardLine !== null && (
                            <span> at {play.start.yardLine}</span>
                          )}
                        </div>
                      )}
                      
                      {/* Play Description */}
                      <div className="text-sm text-white/90 leading-relaxed">
                        {play.text}
                      </div>
                      
                      {/* Game Clock */}
                      {play.clock?.displayValue && (
                        <div className="text-xs text-white/50 mt-1">
                          Q{play.period.number} - {play.clock.displayValue}
                        </div>
                      )}
                    </div>
                    
                    {/* Scoring Play Badge */}
                    {play.scoringPlay && (
                      <Badge className="bg-yellow-500 text-black text-xs font-bold">
                        SCORE
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Information Section */}
      <div className="px-8 py-6 border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Venue Information */}
          {venue && (
            <div className="space-y-2">
              <div className="text-sm text-white/60 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Venue
              </div>
              <div className="text-base text-white/90">
                {venue.fullName}
              </div>
              {venue.address && (
                <div className="text-sm text-white/70">
                  {venue.address.city}, {venue.address.state}
                </div>
              )}
            </div>
          )}
          
          {/* Down & Distance / Last Play */}
          {(situationText || situation?.lastPlay?.text) && (
            <div className="space-y-2">
              <div className="text-sm text-white/60 uppercase tracking-wider">
                {situationText ? 'Current Situation' : 'Last Play'}
              </div>
              {situationText && (
                <div className="text-lg text-white/90 font-semibold">
                  {situationText}
                </div>
              )}
              {situation?.lastPlay?.text && (
                <div className="text-sm text-white/80 leading-relaxed line-clamp-2">
                  {situation.lastPlay.text}
                </div>
              )}
            </div>
          )}
          
          {/* Game Date/Time */}
          <div className="space-y-2">
            <div className="text-sm text-white/60 uppercase tracking-wider">
              {isUpcoming ? 'Scheduled' : isLive ? 'Started' : 'Completed'}
            </div>
            <div className="text-base text-white/90">
              {formatGameDate(game.date)}
            </div>
          </div>
        </div>
      </div>

      {/* Game Notes */}
      {notes && notes.length > 0 && (
        <div className="px-8 py-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Game Notes</div>
            <div className="space-y-2">
              {notes.map((note, idx) => (
                <div key={idx} className="text-base text-white/80 leading-relaxed">
                  • {note.headline}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Betting Odds */}
      {odds && (
        <div className="px-8 py-6 border-t border-white/10 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Betting Information
              {odds.provider?.name && (
                <span className="text-white/40">• {odds.provider.name}</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Spread */}
              {odds.spread !== undefined && (
                <div>
                  <div className="text-xs text-white/50 mb-1">Spread</div>
                  <div className="text-xl text-white/90 font-semibold">
                    {odds.spread > 0 ? '+' : ''}{odds.spread}
                  </div>
                </div>
              )}
              
              {/* Over/Under */}
              {odds.overUnder !== undefined && (
                <div>
                  <div className="text-xs text-white/50 mb-1">Over/Under</div>
                  <div className="text-xl text-white/90 font-semibold">
                    {odds.overUnder}
                  </div>
                </div>
              )}
              
              {/* Money Lines */}
              {(odds.awayTeamOdds?.moneyLine || odds.homeTeamOdds?.moneyLine) && (
                <>
                  {odds.awayTeamOdds?.moneyLine && (
                    <div>
                      <div className="text-xs text-white/50 mb-1">{team1.team.abbreviation} ML</div>
                      <div className="text-xl text-white/90 font-semibold">
                        {odds.awayTeamOdds.moneyLine > 0 ? '+' : ''}{odds.awayTeamOdds.moneyLine}
                      </div>
                      {odds.awayTeamOdds.favorite && (
                        <Badge className="mt-1 bg-yellow-500 text-black text-xs">Favorite</Badge>
                      )}
                    </div>
                  )}
                  {odds.homeTeamOdds?.moneyLine && (
                    <div>
                      <div className="text-xs text-white/50 mb-1">{team2.team.abbreviation} ML</div>
                      <div className="text-xl text-white/90 font-semibold">
                        {odds.homeTeamOdds.moneyLine > 0 ? '+' : ''}{odds.homeTeamOdds.moneyLine}
                      </div>
                      {odds.homeTeamOdds.favorite && (
                        <Badge className="mt-1 bg-yellow-500 text-black text-xs">Favorite</Badge>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Leaders */}
      {leaders && leaders.length > 0 && (
        <div className="px-8 py-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-4">Game Leaders</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaders.map((leaderCategory, idx) => (
                <div key={idx} className="space-y-3">
                  {leaderCategory.passing && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-xs text-white/50 mb-2">Passing</div>
                      <div className="flex items-center gap-3">
                        {leaderCategory.passing.headshot && (
                          <img 
                            src={leaderCategory.passing.headshot} 
                            alt={leaderCategory.passing.name}
                            className="w-12 h-12 rounded-full bg-white/10"
                          />
                        )}
                        <div>
                          <div className="text-white/90 font-semibold">{leaderCategory.passing.name}</div>
                          <div className="text-white/70 text-sm">{leaderCategory.passing.stats}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {leaderCategory.rushing && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-xs text-white/50 mb-2">Rushing</div>
                      <div className="flex items-center gap-3">
                        {leaderCategory.rushing.headshot && (
                          <img 
                            src={leaderCategory.rushing.headshot} 
                            alt={leaderCategory.rushing.name}
                            className="w-12 h-12 rounded-full bg-white/10"
                          />
                        )}
                        <div>
                          <div className="text-white/90 font-semibold">{leaderCategory.rushing.name}</div>
                          <div className="text-white/70 text-sm">{leaderCategory.rushing.stats}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {leaderCategory.receiving && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-xs text-white/50 mb-2">Receiving</div>
                      <div className="flex items-center gap-3">
                        {leaderCategory.receiving.headshot && (
                          <img 
                            src={leaderCategory.receiving.headshot} 
                            alt={leaderCategory.receiving.name}
                            className="w-12 h-12 rounded-full bg-white/10"
                          />
                        )}
                        <div>
                          <div className="text-white/90 font-semibold">{leaderCategory.receiving.name}</div>
                          <div className="text-white/70 text-sm">{leaderCategory.receiving.stats}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-8 py-4 border-t border-white/10 text-center text-sm text-white/40">
        Updates every 30 seconds • Live game data from ESPN
      </div>
    </div>
  );
  
  return createPortal(overlayContent, document.body);
}

interface TeamPanelProps {
  team: ESPNTeam;
  score: number;
  hasPossession: boolean;
  timeouts?: number;
}

function TeamPanel({ team, score, hasPossession, timeouts = 3 }: TeamPanelProps) {
  const possessionLabel = hasPossession ? `Possession: ${team.team.abbreviation}` : '';
  
  return (
    <div className="flex-1 relative">
      {/* Possession Indicator - Football Icon Above */}
      {hasPossession && (
        <div 
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
          aria-label={possessionLabel}
        >
          <Football className="w-10 h-10 text-yellow-400 animate-bounce" weight="fill" />
        </div>
      )}
      
      {/* Panel Container */}
      <div 
        className={`
          flex flex-col items-center p-8 rounded-2xl bg-white/5
          transition-all duration-300
          ${hasPossession ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]' : ''}
        `}
      >
        {/* Team Logo */}
        {team.team.logo && (
          <img 
            src={team.team.logo} 
            alt={team.team.name}
            className="w-32 h-32 object-contain mb-4"
          />
        )}
        
        {/* Team Abbreviation */}
        <div className="text-3xl font-bold mb-2">{team.team.abbreviation}</div>
        
        {/* Record */}
        {team.records?.[0]?.summary && (
          <div className="text-sm text-white/60 mb-4">{team.records[0].summary}</div>
        )}
        
        {/* Score - Large and Prominent */}
        <div className="text-7xl font-bold tabular-nums mb-6">
          {score}
        </div>
        
        {/* Timeouts Visualization */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-white/50 uppercase tracking-wider">Timeouts</div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => {
              const hasTimeout = i < (timeouts || 0);
              return (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${hasTimeout ? 'bg-green-500' : 'bg-white/15'}`}
                  aria-label={`Timeout ${i + 1}: ${hasTimeout ? 'Available' : 'Used'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
