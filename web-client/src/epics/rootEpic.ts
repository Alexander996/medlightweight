import { combineEpics, Epic as ReduxObservableEpic } from 'redux-observable'
import { catchError } from 'rxjs/operators'
import { History } from 'history'

import { Action } from 'actions'
import { Store } from 'store/store'
import { AjaxObservable } from 'network/ajax'
import { logError } from 'logging'

import { authEpics } from './authEpics/authEpics'
import { navigationEpics } from './navigationEpics/navigationEpics'

export type EpicDependencies = {
  history: History
  ajax: AjaxObservable
}

export type Epic = ReduxObservableEpic<Action, Action, Store, EpicDependencies>

const epics: Epic[] = [
  ...authEpics,
  ...navigationEpics,
]

export const rootEpic: Epic = (action$, store$, dependencies) => {
  return combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      logError(error)
      return source
    }),
  )
}