import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store'

export function useThunkDispatch() {
  const dispatch: AppDispatch = useDispatch()
  return dispatch
}
