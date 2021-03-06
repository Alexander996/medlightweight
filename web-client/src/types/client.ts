import { Map as IMap } from 'immutable'

import { API } from 'types/api'

export namespace CLIENT {
  /* Common */

  export type CommentBase = {
    id: number
    text: string
    ownerId: number
    createdAt: Date
    updatedAt: Date
  }

  /* Requests */

  export enum RequestStatus {
    NOT_STARTED = 'NOT_STARTED',
    LOADING = 'LOADING',
    CANCELED = 'CANCELED',
    LOADED = 'LOADED',
    ERROR = 'ERROR',
  }

  export type RequestName = (
    Requests.SignInRequest
    | Requests.LoadAppRequest
    | Requests.FetchSurveysListRequest
    | Requests.CreateSurveyRequest
    | Requests.EditSurveyRequest
    | Requests.DeleteSurveyRequest
    | Requests.FetchSurveyInfoRequest
    | Requests.FetchPatientsListRequest
    | Requests.FetchPatientInfoRequest
    | Requests.CreatePatientRequest
    | Requests.EditPatientRequest
    | Requests.DeletePatientRequest
    | Requests.FetchAutocompletePatientsRequest
    | Requests.FetchPatientSurveysRequest
    | Requests.FetchUsersListRequest
    | Requests.FetchCurrentUserRequest
    | Requests.FetchSurveyCommentsRequest
    | Requests.AddCommentToSurveyRequest
  )

  export namespace Requests {
    export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST' as const
    export type SignInRequest = typeof SIGN_IN_REQUEST

    export const LOAD_APP_REQUEST = 'LOAD_APP_REQUEST' as const
    export type LoadAppRequest = typeof LOAD_APP_REQUEST

    export const FETCH_SURVEYS_LIST_REQUEST = 'FETCH_SURVEYS_LIST_REQUEST' as const
    export type FetchSurveysListRequest = typeof FETCH_SURVEYS_LIST_REQUEST

    export const CREATE_SURVEY_REQUEST = 'CREATE_SURVEY_REQUEST' as const
    export type CreateSurveyRequest = typeof CREATE_SURVEY_REQUEST

    export const EDIT_SURVEY_REQUEST = 'EDIT_SURVEY_REQUEST' as const
    export type EditSurveyRequest = typeof EDIT_SURVEY_REQUEST

    export const DELETE_SURVEY_REQUEST = 'DELETE_SURVEY_REQUEST' as const
    export type DeleteSurveyRequest = typeof DELETE_SURVEY_REQUEST

    export const FETCH_SURVEY_INFO_REQUEST = 'FETCH_SURVEY_INFO_REQUEST' as const
    export type FetchSurveyInfoRequest = typeof FETCH_SURVEY_INFO_REQUEST

    export const FETCH_PATIENTS_LIST_REQUEST = 'FETCH_PATIENTS_LIST_REQUEST' as const
    export type FetchPatientsListRequest = typeof FETCH_PATIENTS_LIST_REQUEST

    export const FETCH_PATIENT_INFO_REQUEST = 'FETCH_PATIENT_INFO_REQUEST' as const
    export type FetchPatientInfoRequest = typeof FETCH_PATIENT_INFO_REQUEST

    export const CREATE_PATIENT_REQUEST = 'CREATE_PATIENT_REQUEST' as const
    export type CreatePatientRequest = typeof CREATE_PATIENT_REQUEST

    export const EDIT_PATIENT_REQUEST = 'EDIT_PATIENT_REQUEST' as const
    export type EditPatientRequest = typeof EDIT_PATIENT_REQUEST

    export const DELETE_PATIENT_REQUEST = 'DELETE_PATIENT_REQUEST' as const
    export type DeletePatientRequest = typeof DELETE_PATIENT_REQUEST

    export const FETCH_AUTOCOMPLETE_PATIENTS_REQUEST = 'FETCH_AUTOCOMPLETE_PATIENTS_REQUEST' as const
    export type FetchAutocompletePatientsRequest = typeof FETCH_AUTOCOMPLETE_PATIENTS_REQUEST

    export const FETCH_PATIENT_SURVEYS_REQUEST = 'FETCH_PATIENT_SURVEYS_REQUEST' as const
    export type FetchPatientSurveysRequest = typeof FETCH_PATIENT_SURVEYS_REQUEST

    export const FETCH_USERS_LIST_REQUEST = 'FETCH_USERS_LIST_REQUEST' as const
    export type FetchUsersListRequest = typeof FETCH_USERS_LIST_REQUEST

    export const FETCH_CURRENT_USER_REQUEST = 'FETCH_CURRENT_USER_REQUEST' as const
    export type FetchCurrentUserRequest = typeof FETCH_CURRENT_USER_REQUEST

    export const FETCH_SURVEY_COMMENTS_REQUEST = 'FETCH_SURVEY_COMMENTS_REQUEST' as const
    export type FetchSurveyCommentsRequest = typeof FETCH_SURVEY_COMMENTS_REQUEST

    export const ADD_COMMENT_TO_SURVEY_REQUEST = 'ADD_COMMENT_TO_SURVEY_REQUEST' as const
    export type AddCommentToSurveyRequest = typeof ADD_COMMENT_TO_SURVEY_REQUEST
  }

  /* Modals */

  export type Modal = (
    Modals.SurveyModal
    | Modals.ConfirmModal
    | Modals.PatientModal
    | Modals.SelectUsersModal
  )

  export type ModalProps<T extends Modal> = T['props'] & {
    close(): void
    closeAll(): void
  }

  export namespace Modals {
    export const CONFIRM_MODAL_TYPE = 'CONFIRM_MODAL_TYPE' as const
    export const SURVEY_MODAL_TYPE = 'SURVEY_MODAL_TYPE' as const
    export const PATIENT_MODAL_TYPE = 'PATIENT_MODAL_TYPE' as const
    export const SELECT_USERS_MODAL_TYPE = 'SELECT_USERS_MODAL_TYPE' as const

    export type ConfirmModal = {
      type: typeof CONFIRM_MODAL_TYPE
      props: {
        title?: string
        description?: string
        cancelButtonText?: string
        okButtonText?: string
        requestName?: RequestName
        onCancelClick?(): void
        onOkClick?(): void
      }
    }

    export type SurveyModal = {
      type: typeof SURVEY_MODAL_TYPE
      props?: {
        survey?: Survey
        initialPatientId?: number
        disablePatient?: boolean
      }
    }

    export type PatientModal = {
      type: typeof PATIENT_MODAL_TYPE
      props?: {
        patient?: Patient
        initialName?: string
        submitCallback?(patient: Patient): void
      }
    }

    export type SelectUsersModal = {
      type: typeof SELECT_USERS_MODAL_TYPE
      props?: {
        multiple?: boolean
        initialUserIds?: number | number[]
        requestName?: RequestName
        onCancelClick?(): void
        onOkClick?(value?: User | User[]): void
      }
    }
  }

  /* Users */

  export type User = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }

  export type UsersMap = IMap<number, User>

  /* Surveys */

  export type Survey = {
    id: number
    name: string
    description?: string
    directory: string
    createdAt: Date
    updatedAt: Date
    ownerId: number
    patientId?: number
    userIds: number[]
  }

  export type SurveysMap = IMap<number, Survey>

  export type SurveysListFilters = {
    page?: number
    pageSize?: number
    searchText?: string
  }

  export type SurveysListFiltersOptions = {
    fetchSurveysList?: boolean
  }

  /* Surveys Comments */

  export type SurveyComment = CommentBase & {
    surveyId: number
  }

  export type SurveyCommentsMap = IMap<number, SurveyComment>

  export type SurveyCommentsInfo = {
    commentsListIds: number[]
  }

  export type SurveysCommentsInfoMap = IMap<number, SurveyCommentsInfo>

  /* Patients */

  export type Patient = {
    id: number
    name: string
    gender: API.Gender
    birth: Date
    age: number
    ownerId: number
    createdAt: Date
    updatedAt: Date
  }

  export type PatientsMap = IMap<number, Patient>

  export type PatientsListFilters = {
    page?: number
    pageSize?: number
    searchText?: string
  }

  export type PatientsListFiltersOptions = {
    fetchPatientsList?: boolean
  }

  /* Patients Surveys */

  export type PatientSurveysInfo = {
    surveysListIds: number[]
    totalCount: number
  }

  export type PatientsSurveysMap = IMap<number, PatientSurveysInfo>

  export type PatientSurveysFiltersOptions = {
    fetchPatientSurveys?: boolean
  }

  /* Events */

  export type InteractionEvent = {
    srcEvent: Event
    target: Element
    isFirst: boolean
    isFinal: boolean
  }

  export type PanInteractionEvent = InteractionEvent & {
    srcEvent: MouseEvent | PointerEvent | TouchEvent
  }

  export type PointerInteractionEvent = PanInteractionEvent & {
    srcEvent: PointerEvent
    deltaX: number
    deltaY: number
  }

  export type ZoomInteractionEvent = InteractionEvent & {
    srcEvent: WheelEvent
    deltaX: number
    deltaY: number
  }

  export type SlicingInteractionEvent = InteractionEvent & {
    value: number
  }

  /* Remote Rendering */

  export namespace RemoteRendering {
    export enum InteractionMode {
      MODE_2D = '2D',
      MODE_3D = '3D',
      OPACITY = 'OPACITY',
    }

    export enum RepresentationMode {
      VOLUME = 'Volume',
      SLICE = 'Slice',
    }

    export enum SliceMode {
      XY = 'XY Plane',
      XZ = 'XZ Plane',
      YZ = 'YZ Plane',
    }

    export type RenderImageOptions = {
      size: [number, number]
      interact: boolean
    }
  }

  export namespace ParaView {
    export namespace ViewportMouseInteraction {
      export type Options = {
        x: number
        y: number
        buttonLeft: boolean
        buttonMiddle: boolean
        buttonRight: boolean
        shiftKey: number | boolean
        ctrlKey: number | boolean
        altKey: number | boolean
        metaKey: number | boolean
        action: 'down' | 'move' | 'up'
      }
    }

    export namespace ViewportImageRender {
      export type Options = {
        size: [number, number]
        mtime: number
        quality: number
        localTime: number
        clearCache: boolean
      }
    }

    export namespace RendererDICOMRender {
      export type Options = {
        path: string
      }
    }

    export namespace RendererInteractionModeSet {
      export type Options = {
        mode: API.ParaView.InteractionMode
      }
    }

    export namespace RendererDICOMOpacityInteraction {
      export type Options = {
        pointDelta: number
        opacityDelta: number
        action: 'down' | 'move' | 'up'
      }
    }

    export namespace RendererDICOMRepresentationSet {
      export type Options = {
        mode: API.ParaView.RepresentationMode
      }
    }

    export namespace RendererDICOMSliceModeSet {
      export type Options = {
        mode: API.ParaView.SliceMode
      }
    }

    export namespace RendererDICOMCurrentSliceSet {
      export type Options = {
        slice: number
      }
    }
  }
}
