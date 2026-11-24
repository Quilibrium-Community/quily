import { useLocalStorage } from './useLocalStorage';

export function useWelcomeEffects() {
  return useLocalStorage<boolean>('welcome-effects', true);
}
