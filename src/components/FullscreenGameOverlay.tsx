import { useEffect } from 'react';
import { X, Football } from '@phosphor-icons/react';
import { Game, ESPNTeam } from '@/types/sports';
import { getTeamScore, formatDownAndDistance } from '@/lib/sports-utils';

interface FullscreenGameOverlayProps {
  game: Game;
  onClose: () => void;
}

export function FullscreenGameOverlay({ game, onClose }: FullscreenGameOverlayProps) {
  const competition = game.competitions?.[0];
  
  // Render nothing if missing competition or competitors
  if (!competition || !competition.competitors || competition.competitors.length < 2) {
    return null;
  }

  const [team1, team2] = competition.competitors;
  const situation = competition.situation;
  const status = game.status;

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Format quarter display
  const getQuarterText = (period?: number): string => {
    if (!period) return 'Q1';
    if (period === 1) return 'Q1';
    if (period === 2) return 'Q2';
    if (period === 3) return 'Q3';
    if (period === 4) return 'Q4';
    return `OT${period - 4}`;
  };

  // Format down & distance with yard line
  const getDownDistanceYardLine = (): string => {
    const parts: string[] = [];
    
    if (situation?.down) {
      const dd = formatDownAndDistance(situation.down, situation.distance);
      if (dd) parts.push(dd);
    }
    
    if (situation?.yardLine !== undefined && situation?.yardLine !== null) {
      parts.push(`at ${situation.yardLine}`);
    }
    
    return parts.join(' ');
  };

  // Get team's record summary
  const getRecordSummary = (team: ESPNTeam): string => {
    const record = team.records?.find(r => r.type === 'total');
    return record?.summary || '';
  };

  // Get timeouts (default to 3 if undefined)
  const getTimeouts = (team: ESPNTeam): number => {
    return team.timeouts !== undefined ? team.timeouts : 3;
  };

  // Helper function to check if a team has possession (case-insensitive comparison)
  const checkPossession = (team: ESPNTeam, possessionId?: string): boolean => {
    if (!possessionId) return false;
    const possessionLower = possessionId.toLowerCase();
    return possessionLower === team.team.id.toLowerCase() || 
           possessionLower === team.id.toLowerCase() ||
           possessionLower === team.team.abbreviation.toLowerCase();
  };

  // Check possession
  const team1HasPossession = checkPossession(team1, situation?.possession);
  const team2HasPossession = checkPossession(team2, situation?.possession);

  // Render team panel
  const renderTeamPanel = (team: ESPNTeam, hasPossession: boolean) => {
    const timeouts = getTimeouts(team);
    const score = getTeamScore(team);
    const record = getRecordSummary(team);

    return (
      <div 
        className={`flex flex-col items-center justify-center p-8 space-y-6 relative ${
          hasPossession ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)]' : ''
        }`}
        aria-label={hasPossession ? `Possession: ${team.team.abbreviation}` : undefined}
      >
        {/* Possession indicator - Football icon */}
        {hasPossession && (
          <div className="absolute -top-8 animate-bounce">
            <Football className="w-10 h-10 text-yellow-400" weight="fill" />
          </div>
        )}

        {/* Team Logo */}
        {team.team.logo && (
          <img 
            src={team.team.logo} 
            alt={`${team.team.displayName} logo`}
            className="h-32 w-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Team Info */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold">{team.team.abbreviation}</h2>
          {record && <p className="text-xl text-white/70">{record}</p>}
        </div>

        {/* Score */}
        <div className="text-7xl font-extrabold tabular-nums">
          {score}
        </div>

        {/* Timeouts */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded ${
                i < timeouts ? 'bg-green-500' : 'bg-white/15'
              }`}
              aria-label={i < timeouts ? 'Timeout available' : 'Timeout used'}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-6 text-xl">
          {/* Quarter */}
          <span className="font-bold">{getQuarterText(status.period)}</span>
          
          {/* Clock */}
          <span className="font-mono">{status.displayClock || '0:00'}</span>
          
          {/* Down & Distance with Yard Line */}
          {getDownDistanceYardLine() && (
            <span className="text-white/80">{getDownDistanceYardLine()}</span>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close overlay"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main Area - Team Panels */}
      <main className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 p-8">
        {renderTeamPanel(team1, team1HasPossession)}
        {renderTeamPanel(team2, team2HasPossession)}
      </main>

      {/* Last Play Text */}
      {situation?.lastPlay?.text && (
        <div className="px-8 py-6 border-t border-white/10 text-center">
          <p className="text-lg text-white/90">
            {situation.lastPlay.text}
          </p>
        </div>
      )}
    </div>
  );
}
