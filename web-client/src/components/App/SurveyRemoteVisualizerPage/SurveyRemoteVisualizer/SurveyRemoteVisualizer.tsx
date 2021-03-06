import React from 'react'
import { withSnackbar, WithSnackbarProps } from 'notistack'

import { CLIENT } from 'types/client'
import { ParaViewRemoteVisualizer } from 'components/common/ParaViewRemoteVisualizer/ParaViewRemoteVisualizer'
import { ParaViewRemoteRenderingSession } from 'remoteRendering/ParaViewRemoteRenderingSession'
import { showUnexpectedError } from 'utils/snackbarUtils'

type OwnProps = {
  survey: CLIENT.Survey
  goBackUrl?: string
  className?: string
}

type Props = OwnProps & WithSnackbarProps

class SurveyRemoteVisualizerCmp extends React.Component<Props> {
  session: ParaViewRemoteRenderingSession

  constructor(props: Props) {
    super(props)

    const { survey } = props

    this.session = new ParaViewRemoteRenderingSession({
      url: 'ws://localhost:1234/ws',
      wslinkSecret: 'wslink-secret',
    })

    this.session.onOpen(async () => {
      const { result: { clientID } } = await this.session.wslinkHello()
      this.session.setClientId(clientID)

      const { result: { view } } = await this.session.rendererDICOMRender({
        path: survey.directory,
      })
      this.session.setViewId(view)

      this.session.startRendererPingInterval()
      this.session.sessionReady()
    })

    this.session.onError(() => {
      showUnexpectedError(this.props.enqueueSnackbar)
    })

    this.session.connect()
  }

  componentWillUnmount() {
    this.session.close()
  }

  render() {
    const { goBackUrl } = this.props

    return (
      <ParaViewRemoteVisualizer
        session={this.session}
        goBackUrl={goBackUrl}
      />
    )
  }
}

export const SurveyRemoteVisualizer = withSnackbar(SurveyRemoteVisualizerCmp)
