import React, { useEffect, useCallback } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core'
import { createForm, FormComponentProps } from 'rc-form'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack'

import { CLIENT } from 'types/client'
import { API } from 'types/api'
import { Action, Actions, createAction } from 'actions'
import { Store } from 'store/store'
import { DialogTitle } from 'components/modals/DialogTitle/DialogTitle'
import { FormField } from 'components/common/FormField/FormField'
import { FORM_FIELD_IS_REQUIRED } from 'utils/formUtils'
import { usePrevious } from 'hooks'
import { showUnexpectedError } from 'utils/snackbarUtils'
import { Upload } from 'components/common/Upload/Upload'
import { PatientsSelect } from 'components/common/PatientsSelect/PatientsSelect'
import { getFromMap } from 'utils/immutableUtils'

import styles from './SurveyModal.scss'

type OwnProps = CLIENT.ModalProps<CLIENT.Modals.SurveyModal>

type ConnectedProps = {
  createSurveyRequest: CLIENT.RequestStatus
  editSurveyRequest: CLIENT.RequestStatus
  surveyPatient?: CLIENT.Patient
  initialPatient?: CLIENT.Patient
}

type DispatchedProps = {
  createSurvey(data: API.MlwSurvey.Create.Req): Action
  editSurvey(id: number, data: API.MlwSurvey.Update.Req): Action
  cancelRequest(request: CLIENT.RequestName): Action
}

type Props = OwnProps & ConnectedProps & DispatchedProps & FormComponentProps

enum SurveyModalFields {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  PATIENT = 'PATIENT',
  FILES = 'FILES',
}

const SurveyModalCmp: React.FC<Props> = (props) => {
  const { form, survey, surveyPatient, createSurveyRequest, editSurveyRequest, initialPatient, disablePatient } = props
  const request = survey ? editSurveyRequest : createSurveyRequest
  const loading = request === CLIENT.RequestStatus.LOADING

  const { enqueueSnackbar } = useSnackbar()
  const prevRequest = usePrevious(request)

  useEffect(() => {
    if (prevRequest === CLIENT.RequestStatus.LOADING && request === CLIENT.RequestStatus.ERROR) {
      showUnexpectedError(enqueueSnackbar)
    }

    if (prevRequest === CLIENT.RequestStatus.LOADING && request === CLIENT.RequestStatus.LOADED) {
      props.close()
    }
  }, [prevRequest, request])

  const submitSurvey = useCallback(() => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const patient: CLIENT.Patient | null = values[SurveyModalFields.PATIENT]
        const fileList: FileList = values[SurveyModalFields.FILES]

        if (survey) {
          props.editSurvey(survey.id, {
            name: values[SurveyModalFields.NAME],
            description: values[SurveyModalFields.DESCRIPTION],
            patient: patient ? patient.id : null,
            files: fileList && Array.from(fileList),
          })
        } else {
          props.createSurvey({
            name: values[SurveyModalFields.NAME],
            description: values[SurveyModalFields.DESCRIPTION],
            patient: patient ? patient.id : undefined,
            files: Array.from(fileList),
          })
        }
      }
    })
  }, [survey])

  const onCancelClick = useCallback(() => {
    if (loading) {
      props.cancelRequest(survey ? CLIENT.Requests.EDIT_SURVEY_REQUEST : CLIENT.Requests.CREATE_SURVEY_REQUEST)
    } else {
      props.close()
    }
  }, [loading, survey])

  return (
    <Dialog
      open
      fullWidth
      maxWidth='sm'
      disableBackdropClick={loading}
      scroll='body'
      onClose={props.closeAll}
    >
      <DialogTitle
        disabled={loading}
        onClose={props.close}
      >
        {survey ? 'Редактировать обследование' : 'Добавить обследование'}
      </DialogTitle>
      <DialogContent className={styles.content}>
        <Grid container direction='column' spacing={3}>
          <Grid item>
            <FormField
              fullWidth
              errors={form.getFieldError(SurveyModalFields.NAME)}
            >
              {form.getFieldDecorator(SurveyModalFields.NAME, {
                initialValue: survey && survey.name || '',
                rules: [
                  { required: true, message: FORM_FIELD_IS_REQUIRED },
                ],
              })(
                <TextField
                  label='Название'
                  variant='outlined'
                  required
                  disabled={loading}
                />,
              )}
            </FormField>
          </Grid>
          <Grid item>
            <FormField
              fullWidth
            >
              {form.getFieldDecorator(SurveyModalFields.DESCRIPTION, {
                initialValue: survey && survey.description || '',
              })(
                <TextField
                  label='Описание'
                  variant='outlined'
                  multiline
                  rows={3}
                  rowsMax={Infinity}
                  disabled={loading}
                />,
              )}
            </FormField>
          </Grid>
          <Grid item>
            <FormField
              fullWidth
            >
              {form.getFieldDecorator(SurveyModalFields.PATIENT, {
                initialValue: surveyPatient || initialPatient || null,
                getValueFromEvent: (_event, value) => value,
              })(
                <PatientsSelect
                  disabled={disablePatient || loading}
                />,
              )}
            </FormField>
          </Grid>
          <Grid item>
            <FormField
              fullWidth
              errors={form.getFieldError(SurveyModalFields.FILES)}
            >
              <FormHelperText className={styles.uploadLabel} required>
                Выберите файлы
              </FormHelperText>
              {form.getFieldDecorator(SurveyModalFields.FILES, {
                rules: [
                  { required: !survey, message: FORM_FIELD_IS_REQUIRED },
                ],
              })(
                <Upload
                  directory
                  disabled={loading}
                  className={styles.uploadButton}
                />,
              )}
            </FormField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color='secondary'
          onClick={onCancelClick}
        >
          Отмена
        </Button>
        <Button
          color='primary'
          disabled={loading}
          endIcon={loading && <CircularProgress size='1em' color='secondary'/>}
          onClick={submitSurvey}
        >
          {survey ? 'Редактировать' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (state: Store, ownProps: OwnProps): ConnectedProps => {
  const { patientsMap } = state.patients
  const { survey, initialPatientId } = ownProps
  const surveyPatient = survey && survey.patientId !== undefined ? getFromMap(patientsMap, survey.patientId) : undefined
  const initialPatient = initialPatientId !== undefined ? getFromMap(patientsMap, initialPatientId) : undefined

  return {
    createSurveyRequest: state.requests[CLIENT.Requests.CREATE_SURVEY_REQUEST],
    editSurveyRequest: state.requests[CLIENT.Requests.EDIT_SURVEY_REQUEST],
    surveyPatient,
    initialPatient,
  }
}

const mapDispatchToProps: DispatchedProps = {
  createSurvey: (data) => createAction(Actions.API_CREATE_SURVEY, data),
  editSurvey: (id, data) => createAction(Actions.API_EDIT_SURVEY, { id, ...data }),
  cancelRequest: (request) => createAction(Actions.CANCEL_REQUEST, { request }),
}

export const SurveyModal = connect(mapStateToProps, mapDispatchToProps)(
  createForm()(SurveyModalCmp),
)
