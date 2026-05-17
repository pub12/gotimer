export type { TimerStrategy, TimerDisplay, Warning } from "./types";

export { countdownStrategy } from "./countdown";
export type { CountdownState, CountdownConfig } from "./countdown";

export { chessClockStrategy } from "./chess-clock";
export type { ChessClockState, ChessClockConfig, ChessClockPlayer } from "./chess-clock";

export { roundTimerStrategy } from "./round-timer";
export type { RoundTimerState } from "./round-timer";

export { intervalStrategy } from "./interval";
export type { IntervalState, IntervalConfig } from "./interval";

export { intervalReminderStrategy } from "./interval-reminder";
export type {
  IntervalReminderState,
  IntervalReminderConfig,
} from "./interval-reminder";

export { multiStepStrategy } from "./multi-step";
export type { MultiStepState, MultiStepConfig, StepDefinition } from "./multi-step";

export { ambientStrategy } from "./ambient";
export type { AmbientState, AmbientConfig } from "./ambient";

export { calculatorTimerStrategy } from "./calculator-timer";
export type { CalculatorTimerState, CalculatorTimerConfig } from "./calculator-timer";

export { multiTimerStrategy } from "./multi-timer";
export type { MultiTimerState, MultiTimerConfig, SubTimer } from "./multi-timer";

export { turnTimerStrategy } from "./turn-timer";
export type { TurnTimerState, TurnTimerConfig, TurnPlayer } from "./turn-timer";

export { multiPlayerTurnTimerStrategy } from "./multi-player-turn-timer";
export type {
  MPState,
  MPConfig,
  MPMode,
  MPPlayer,
} from "./multi-player-turn-timer";

export { enlargerStrategy } from "./enlarger";
export type { EnlargerState, EnlargerConfig, EnlargerMode } from "./enlarger";

export { stopwatchStrategy } from "./stopwatch";
export type { StopwatchState, StopwatchLap } from "./stopwatch";

export { espressoShotStrategy } from "./espresso-shot";
export type { EspressoState, EspressoConfig } from "./espresso-shot";

import type { TimerStrategy } from "./types";
import { countdownStrategy } from "./countdown";
import { chessClockStrategy } from "./chess-clock";
import { roundTimerStrategy } from "./round-timer";
import { intervalStrategy } from "./interval";
import { intervalReminderStrategy } from "./interval-reminder";
import { multiStepStrategy } from "./multi-step";
import { ambientStrategy } from "./ambient";
import { calculatorTimerStrategy } from "./calculator-timer";
import { multiTimerStrategy } from "./multi-timer";
import { turnTimerStrategy } from "./turn-timer";
import { multiPlayerTurnTimerStrategy } from "./multi-player-turn-timer";
import { enlargerStrategy } from "./enlarger";
import { stopwatchStrategy } from "./stopwatch";
import { espressoShotStrategy } from "./espresso-shot";

/** Registry of all timer strategies, keyed by type string */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const STRATEGY_REGISTRY: Record<string, TimerStrategy<any>> = {
  countdown: countdownStrategy,
  "chess-clock": chessClockStrategy,
  "round-timer": roundTimerStrategy,
  interval: intervalStrategy,
  "interval-reminder": intervalReminderStrategy,
  "multi-step": multiStepStrategy,
  ambient: ambientStrategy,
  "calculator-timer": calculatorTimerStrategy,
  "multi-timer": multiTimerStrategy,
  "turn-timer": turnTimerStrategy,
  "multi-player-turn-timer": multiPlayerTurnTimerStrategy,
  enlarger: enlargerStrategy,
  stopwatch: stopwatchStrategy,
  "espresso-shot": espressoShotStrategy,
};

/** Look up a strategy by type string */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get_strategy(type: string): TimerStrategy<any> | undefined {
  return STRATEGY_REGISTRY[type];
}
