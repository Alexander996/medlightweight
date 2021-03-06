import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Toolbar } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong'
import ThreeDRotationIcon from '@material-ui/icons/ThreeDRotation'
import OpenWithIcon from '@material-ui/icons/OpenWith'
import OpacityIcon from '@material-ui/icons/Opacity'

import { CLIENT } from 'types/client'
import { TooltipIconButton } from 'components/common/TooltipIconButton/TooltipIconButton'

import styles from './RemoteVisualizerTopToolbar.scss'

import { RepresentationModeSelect } from '../RepresentationModeSelect/RepresentationModeSelect'
import { SliceModeSelect } from '../SliceModeSelect/SliceModeSelect'

type OwnProps = {
  interactionMode: CLIENT.RemoteRendering.InteractionMode
  representationMode: CLIENT.RemoteRendering.RepresentationMode
  sliceMode: CLIENT.RemoteRendering.SliceMode
  disabled?: boolean
  goBackUrl?: string
  resetCamera(): void
  setInteractionMode(interactionMode: CLIENT.RemoteRendering.InteractionMode): void
  setRepresentationMode(representationMode: CLIENT.RemoteRendering.RepresentationMode): void
  setSliceMode(sliceMode: CLIENT.RemoteRendering.SliceMode): void
}

type Props = OwnProps

const RemoteVisualizerTopToolbarCmp: React.FC<Props> = (props) => {
  const { interactionMode, representationMode, sliceMode, disabled, goBackUrl } = props

  const history = useHistory()

  const goBack = useCallback(() => {
    if (goBackUrl) {
      history.push(goBackUrl)
    } else {
      history.goBack()
    }
  }, [history, goBackUrl])

  const onRepresentationModeChange = useCallback((
    event: React.ChangeEvent<{ value: CLIENT.RemoteRendering.RepresentationMode }>,
  ) => {
    const representationMode = event.target.value

    props.setRepresentationMode(representationMode)

    if (representationMode === CLIENT.RemoteRendering.RepresentationMode.VOLUME) {
      props.setInteractionMode(CLIENT.RemoteRendering.InteractionMode.MODE_3D)
    } else if (representationMode === CLIENT.RemoteRendering.RepresentationMode.SLICE) {
      props.setInteractionMode(CLIENT.RemoteRendering.InteractionMode.MODE_2D)
    }
  }, [])

  const onSliceModeChange = useCallback((
    event: React.ChangeEvent<{ value: CLIENT.RemoteRendering.SliceMode }>,
  ) => {
    const sliceMode = event.target.value
    props.setSliceMode(sliceMode)
  }, [])

  return (
    <Toolbar className={styles.container}>
      <TooltipIconButton
        tooltip='Назад'
        className={styles.backButton}
        onClick={goBack}
      >
        <ArrowBackIcon/>
      </TooltipIconButton>
      <RepresentationModeSelect
        value={representationMode}
        disabled={disabled}
        onChange={onRepresentationModeChange}
        className={styles.representationModeSelect}
      />
      {representationMode === CLIENT.RemoteRendering.RepresentationMode.SLICE &&
        <SliceModeSelect
          value={sliceMode}
          disabled={disabled}
          onChange={onSliceModeChange}
          className={styles.sliceModeSelect}
        />
      }
      <TooltipIconButton
        disabled={disabled}
        tooltip='Сбросить камеру'
        onClick={props.resetCamera}
      >
        <CenterFocusStrongIcon/>
      </TooltipIconButton>
      {representationMode === CLIENT.RemoteRendering.RepresentationMode.VOLUME &&
        <TooltipIconButton
          isActive={interactionMode === CLIENT.RemoteRendering.InteractionMode.MODE_3D}
          disabled={disabled}
          tooltip='Вращение'
          onClick={() => props.setInteractionMode(CLIENT.RemoteRendering.InteractionMode.MODE_3D)}
        >
          <ThreeDRotationIcon/>
        </TooltipIconButton>
      }
      <TooltipIconButton
        isActive={interactionMode === CLIENT.RemoteRendering.InteractionMode.MODE_2D}
        disabled={disabled}
        tooltip='Перемещение'
        onClick={() => props.setInteractionMode(CLIENT.RemoteRendering.InteractionMode.MODE_2D)}
      >
        <OpenWithIcon/>
      </TooltipIconButton>
      {representationMode === CLIENT.RemoteRendering.RepresentationMode.VOLUME &&
        <TooltipIconButton
          isActive={interactionMode === CLIENT.RemoteRendering.InteractionMode.OPACITY}
          disabled={disabled}
          tooltip='Прозрачность'
          onClick={() => props.setInteractionMode(CLIENT.RemoteRendering.InteractionMode.OPACITY)}
        >
          <OpacityIcon/>
        </TooltipIconButton>
      }
    </Toolbar>
  )
}

export const RemoteVisualizerTopToolbar = RemoteVisualizerTopToolbarCmp
