/** Cross-component UI events (terminal, games) without prop drilling. */
export const TERMINAL_EVENT = "jrm:terminal"
export const BREAKOUT_EVENT = "jrm:breakout"

export function openTerminal() {
  window.dispatchEvent(new CustomEvent(TERMINAL_EVENT))
}

export function startBreakout() {
  window.dispatchEvent(new CustomEvent(BREAKOUT_EVENT))
}
