import { ref, onBeforeUnmount } from 'vue'
import { logDebug } from '@/modules/logger'

export function useTimers() {
  const timeouts = ref(new Set())
  const intervals = ref(new Set())
  
  const createTimeout = (callback, delay) => {
    const timeoutId = setTimeout(() => {
      timeouts.value.delete(timeoutId)
      callback()
    }, delay)
    
    timeouts.value.add(timeoutId)
    return timeoutId
  }
  
  const createInterval = (callback, delay) => {
    const intervalId = setInterval(callback, delay)
    intervals.value.add(intervalId)
    return intervalId
  }
  
  const clearManagedTimeout = (timeoutId) => {
    if (timeouts.value.has(timeoutId)) {
      clearTimeout(timeoutId)
      timeouts.value.delete(timeoutId)
    }
  }
  
  const clearManagedInterval = (intervalId) => {
    if (intervals.value.has(intervalId)) {
      clearInterval(intervalId)
      intervals.value.delete(intervalId)
    }
  }
  
  const clearAllTimers = () => {
    timeouts.value.forEach(timeoutId => {
      clearTimeout(timeoutId)
    })
    timeouts.value.clear()
    
    intervals.value.forEach(intervalId => {
      clearInterval(intervalId)
    })
    intervals.value.clear()
    
    logDebug('useTimers.clearAllTimers()', 'All timers cleared')
  }
  
  onBeforeUnmount(() => {
    clearAllTimers()
  })
  
  return {
    createTimeout,
    createInterval,
    clearManagedTimeout,
    clearManagedInterval,
    clearAllTimers,
    activeTimeouts: timeouts,
    activeIntervals: intervals
  }
}