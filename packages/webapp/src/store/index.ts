import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { rootReducer, RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  ;(module as any).hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export default store

/* 
store shape:{
  user {
    id
    email
    username
    workspaces:[_id]
    first_name
    last_name
  }
  current_workspace{
    name
    admin
    users:[_id, name]
    labels:[{_id, name, color}]
    todo:[{_id, name, labels:[id]}]
    in_progress:[task]
    completed:[task]
  }
  entities:{
    workspaces:{

    }
    tasks
  }
}
*/
