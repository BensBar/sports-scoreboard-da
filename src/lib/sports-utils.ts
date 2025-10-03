import { ESPNTeam } from '@/types/sports';

export function getTeamScore(team: ESPNTeam): number {
  return parseInt(team.score) || 0;
}

export function formatTimeRemaining(displayClock?: string): string {
  if (!displayClock) return '';
  return displayClock;
}

export function formatDownAndDistance(down?: number, distance?: number): string {
  if (!down || !distance) return '';
  
  if (down === 1) return `1st & ${distance}`;
  if (down === 2) return `2nd & ${distance}`;
  if (down === 3) return `3rd & ${distance}`;
  if (down === 4) return `4th & ${distance}`;
  
  return '';
}

export function getGameStatusText(status: any): string {
  if (status.type.state === 'pre') {
    return new Date(status.type.detail).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  }
  
  if (status.type.state === 'in') {
    const period = status.period || 1;
    const quarter = period === 1 ? '1st' : 
                   period === 2 ? '2nd' : 
                   period === 3 ? '3rd' : 
                   period === 4 ? '4th' : `OT${period - 4}`;
    return `${quarter} ${status.displayClock || ''}`.trim();
  }
  
  if (status.type.state === 'post') {
    return 'Final';
  }
  
  return status.type.name || '';
}

export function getGameStatusColor(status: any): string {
  if (status.type.state === 'in') return 'bg-primary';
  if (status.type.state === 'pre') return 'bg-accent';
  return 'bg-muted';
}