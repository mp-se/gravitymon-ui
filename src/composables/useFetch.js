import { ref, onBeforeUnmount } from 'vue'
import { logDebug, logError } from '@/modules/logger'

export function useFetch() {
  const controllers = ref(new Set())
  
  const managedFetch = async (url, options = {}) => {
    const controller = new AbortController()
    controllers.value.add(controller)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      controllers.value.delete(controller)
      return response
      
    } catch (error) {
      controllers.value.delete(controller)
      
      if (error.name === 'AbortError') {
        logDebug('useFetch.managedFetch()', 'Request aborted:', url)
        return null
      }
      
      logError('useFetch.managedFetch()', 'Fetch error:', error)
      throw error
    }
  }
  
  const abortAllRequests = () => {
    controllers.value.forEach(controller => {
      controller.abort()
    })
    controllers.value.clear()
    logDebug('useFetch.abortAllRequests()', 'All fetch requests aborted')
  }
  
  const abortRequest = (controller) => {
    if (controllers.value.has(controller)) {
      controller.abort()
      controllers.value.delete(controller)
    }
  }
  
  onBeforeUnmount(() => {
    abortAllRequests()
  })
  
  if (typeof window !== 'undefined') {
    const handleUnload = () => {
      abortAllRequests()
    }
    
    window.addEventListener('beforeunload', handleUnload)
    
    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleUnload)
    })
  }
  
  return {
    managedFetch,
    abortAllRequests,
    abortRequest,
    activeControllers: controllers
  }
}