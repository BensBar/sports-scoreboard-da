import { useEffect, useRef } from 'react';
import { Game } from '@/types/sports';
import { getTeamScore } from '@/lib/sports-utils';

export interface GameChanges {
  scoreChanged: boolean;
  turnoverDetected: boolean;
  previousScores?: { team1: number; team2: number };
  currentScores?: { team1: number; team2: number };
  possessionChanged?: boolean;
}

/**
 * Hook to detect score changes and turnovers in a game
 * Compares current game state with previous state to identify changes
 */
export function useGameChangeDetection(game: Game | null): GameChanges {
  const previousGameRef = useRef<Game | null>(null);
  const changesRef = useRef<GameChanges>({
    scoreChanged: false,
    turnoverDetected: false,
  });

  useEffect(() => {
    if (!game) {
      previousGameRef.current = null;
      changesRef.current = {
        scoreChanged: false,
        turnoverDetected: false,
      };
      return;
    }

    const competition = game.competitions?.[0];
    if (!competition || competition.competitors.length < 2) {
      return;
    }

    const [team1, team2] = competition.competitors;
    const currentTeam1Score = getTeamScore(team1);
    const currentTeam2Score = getTeamScore(team2);
    const currentPossession = competition.situation?.possession;

    const previousGame = previousGameRef.current;
    const changes: GameChanges = {
      scoreChanged: false,
      turnoverDetected: false,
      currentScores: { team1: currentTeam1Score, team2: currentTeam2Score },
    };

    if (previousGame) {
      const prevCompetition = previousGame.competitions?.[0];
      if (prevCompetition && prevCompetition.competitors.length >= 2) {
        const [prevTeam1, prevTeam2] = prevCompetition.competitors;
        const previousTeam1Score = getTeamScore(prevTeam1);
        const previousTeam2Score = getTeamScore(prevTeam2);
        const previousPossession = prevCompetition.situation?.possession;

        changes.previousScores = { team1: previousTeam1Score, team2: previousTeam2Score };

        // Check for score changes
        if (
          currentTeam1Score !== previousTeam1Score ||
          currentTeam2Score !== previousTeam2Score
        ) {
          changes.scoreChanged = true;
        }

        // Check for turnovers (possession change)
        // Only detect turnover if:
        // 1. Both current and previous possessions are defined
        // 2. They are different
        // 3. Neither is undefined or null
        if (
          currentPossession &&
          previousPossession &&
          currentPossession !== previousPossession
        ) {
          changes.possessionChanged = true;
          // A turnover is a possession change without a score change
          // Note: This logic may not catch all edge cases like pick-six or fumble return TD
          // where possession changes AND score changes occur, but those are rare
          if (!changes.scoreChanged) {
            changes.turnoverDetected = true;
          }
        }
      }
    }

    changesRef.current = changes;
    previousGameRef.current = game;
  }, [game]);

  return changesRef.current;
}

/**
 * Hook variant that triggers callbacks when changes are detected
 */
export function useGameChangeCallbacks(
  game: Game | null,
  callbacks: {
    onScoreChange?: (scores: { team1: number; team2: number }) => void;
    onTurnover?: () => void;
  }
): void {
  const changes = useGameChangeDetection(game);
  const previousChangesRef = useRef(changes);

  useEffect(() => {
    const previous = previousChangesRef.current;

    // Only trigger callbacks if this is a new change (not the same as previous)
    if (changes.scoreChanged && !previous.scoreChanged && callbacks.onScoreChange && changes.currentScores) {
      callbacks.onScoreChange(changes.currentScores);
    }

    if (changes.turnoverDetected && !previous.turnoverDetected && callbacks.onTurnover) {
      callbacks.onTurnover();
    }

    previousChangesRef.current = changes;
  }, [changes, callbacks]);
}
