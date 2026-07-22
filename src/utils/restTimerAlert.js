// Synthesizes a short beep via Web Audio (no audio file to bundle/host)
// and triggers a vibration where supported. Both are best-effort — safe
// to call even where the API doesn't exist (e.g. vibrate on iOS Safari)
// or before the user has interacted with the page (some browsers block
// audio until then).
export function playRestCompleteAlert() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // Audio not available/blocked — silently skip, vibration below can still fire.
  }

  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}
