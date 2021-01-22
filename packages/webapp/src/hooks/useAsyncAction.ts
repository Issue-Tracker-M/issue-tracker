import { useEffect, useState } from 'react'
/**
 * Exposes the state of the promise of the given async action, intended to be used for loading indications
 * meaningful state changes are meant to be handled within the action.
 * @param action async action to be used in the effect
 */
export default function useAsyncAction(action: any) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    action().finally(() => {
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [action])

  return loading
}
