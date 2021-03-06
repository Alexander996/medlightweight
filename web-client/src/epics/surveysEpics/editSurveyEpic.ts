import { concat, of, throwError } from 'rxjs'
import { catchError, mergeMap, startWith } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { CLIENT } from 'types/client'
import { API } from 'types/api'
import { Epic } from 'epics/rootEpic'
import { Actions, createAction, createActionEmpty } from 'actions'
import { guardMergeMap, takeUntilCancelRequest } from 'utils/epicsUtils'
import { mapApiSurveyToClient } from 'utils/surveysUtils'

export const editSurveyEpic: Epic = (action$, _state$, deps) => action$.pipe(
  ofType<Actions.ApiEditSurvey>(Actions.API_EDIT_SURVEY),
  guardMergeMap((action) => {
    const url = API.MlwSurvey.MLW_SURVEYS_BASE_URL + action.data.id + '/'
    const req: API.MlwSurvey.Update.Req = action.data
    const isFormData = req.files !== undefined

    return deps.ajax.patch(url, req, { formData: isFormData }).pipe(
      takeUntilCancelRequest(action$, CLIENT.Requests.EDIT_SURVEY_REQUEST),
      mergeMap((resp: API.MlwSurvey.Update.Resp) => {
        const clientSurvey = mapApiSurveyToClient(resp)

        return of(
          createActionEmpty(Actions.POP_MODAL),
          createAction(Actions.UPDATE_SURVEYS, { surveys: [clientSurvey] }),
          createAction(Actions.CHANGE_REQUEST_STATUS, {
            request: CLIENT.Requests.EDIT_SURVEY_REQUEST,
            status: CLIENT.RequestStatus.LOADED,
          }),
        )
      }),
      startWith(
        createAction(Actions.CHANGE_REQUEST_STATUS, {
          request: CLIENT.Requests.EDIT_SURVEY_REQUEST,
          status: CLIENT.RequestStatus.LOADING,
        }),
      ),
      catchError((error) => {
        return concat(
          of(
            createAction(Actions.CHANGE_REQUEST_STATUS, {
              request: CLIENT.Requests.EDIT_SURVEY_REQUEST,
              status: CLIENT.RequestStatus.ERROR,
            }),
          ),
          throwError(error),
        )
      }),
    )
  }),
)
