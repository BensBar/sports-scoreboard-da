import { useEffect } from 'react';
import { X, Football } from '@phosphor-icons/react';
import { Game, ESPNTeam } from '@/types/sports';
import { getTeamScore, formatDownAndDistance } from '@/lib/sports-utils';
import { Button } from '@/components/ui/button';

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
  
  const team1Score = getTeamScore(team1);
  const team2Score = getTeamScore(team2);
  
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

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex flex-col text-white"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
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
        className="flex-1 flex items-center justify-center px-8 py-12"
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

      {/* Last Play */}
      {situation?.lastPlay?.text && (
        <div className="px-8 py-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-white/60 uppercase tracking-wider mb-2">Last Play</div>
            <div className="text-lg text-white/90 leading-relaxed">
              {situation.lastPlay.text}
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
