import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Container, Grid, Input, CircularProgress, InputLabel } from '@material-ui/core'
import { FormComponentProps, createForm } from 'rc-form'
import { useSnackbar } from 'notistack'

import { CLIENT } from 'types/client'
import { API } from 'types/api'
import { Store } from 'store/store'
import { createAction, Action, Actions } from 'actions'
import { usePrevious } from 'hooks'
import { FormField } from 'components/common/FormField/FormField'
import { showUnexpectedError } from 'utils/snackbarUtils'

import styles from './SignInPage.scss'

type ConnectedProps = {
  signInRequest: CLIENT.RequestStatus
}

type DispatchedProps = {
  signIn(data: API.MlwAuth.SignIn.Req): Action
}

type Props = ConnectedProps & DispatchedProps & FormComponentProps

enum SignInFormField {
  USERNAME = 'USERNAME',
  PASSWORD = 'PASSWORD',
}

const SignInPageCmp: React.FC<Props> = (props) => {
  const { form, signInRequest } = props
  const loading = signInRequest === CLIENT.RequestStatus.LOADING
  const username = form.getFieldValue(SignInFormField.USERNAME)
  const password = form.getFieldValue(SignInFormField.PASSWORD)

  const { enqueueSnackbar } = useSnackbar()
  const prevSignInRequest = usePrevious(signInRequest)

  useEffect(() => {
    if (prevSignInRequest === CLIENT.RequestStatus.LOADING && signInRequest === CLIENT.RequestStatus.ERROR) {
      showUnexpectedError(enqueueSnackbar)
    }
  }, [signInRequest, prevSignInRequest])

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    form.validateFields((errors, values) => {
      if (!errors) {
        const username = values[SignInFormField.USERNAME]
        const password = values[SignInFormField.PASSWORD]

        props.signIn({ username, password })
      }
    })
  }, [props.signIn])

  return (
    <Container className={styles.container}>
      <Grid container justify='center' alignItems='center' className={styles.gridContainer}>
        <Grid container item direction='column' xs={12} sm={6} lg={4}>
          <form onSubmit={onFormSubmit}>
            <Grid container item direction='column' spacing={3}>
              <Grid item>
                <FormField
                  label='Имя пользователя'
                  fullWidth
                  disabled={loading}
                  LabelComponent={InputLabel}
                >
                  {form.getFieldDecorator(SignInFormField.USERNAME, {
                    initialValue: '',
                  })(
                    <Input/>,
                  )}
                </FormField>
              </Grid>
              <Grid item>
                <FormField
                  label='Пароль'
                  fullWidth
                  disabled={loading}
                  LabelComponent={InputLabel}
                >
                  {form.getFieldDecorator(SignInFormField.PASSWORD, {
                    initialValue: '',
                  })(
                    <Input type='password'/>,
                  )}
                </FormField>
              </Grid>
              <Grid container item justify='center'>
                <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={!username || !password || loading}
                    endIcon={loading && <CircularProgress size='1em' style={{ color: 'white' }}/>}
                  >
                    Войти
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  )
}

const mapStateToProps = (state: Store): ConnectedProps => {
  return {
    signInRequest: state.requests[CLIENT.Requests.SIGN_IN_REQUEST],
  }
}

const mapDispatchToProps: DispatchedProps = {
  signIn: (data) => createAction(Actions.SIGN_IN, data),
}

export const SignInPage = connect(mapStateToProps, mapDispatchToProps)(
  createForm()(SignInPageCmp),
)
