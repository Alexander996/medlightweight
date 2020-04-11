import React from 'react'
import { connect } from 'react-redux'

import { CLIENT } from 'types/client'
import { Store } from 'store/store'
import { Actions, createActionEmpty } from 'actions'

import { SurveyModal } from '../SurveyModal/SurveyModal'

type ConnectedProps = {
  modals: CLIENT.Modal[]
}

type DispatchedProps = {
  popModal(): void
  closeAllModal(): void
}

type Props = ConnectedProps & DispatchedProps

const ModalsStackCmp: React.FC<Props> = (props) => {
  const { modals } = props

  return (
    <>
      {modals.map((modal) => {
        switch (modal.type) {
          case CLIENT.Modals.SURVEY_MODAL_TYPE:
            return (
              <SurveyModal
                key={modal.type}
                close={props.popModal}
                closeAll={props.closeAllModal}
                {...modal.props}
              />
            )
        }
      })}
    </>
  )
}

const mapStateToProps = (state: Store): ConnectedProps => {
  return {
    modals: state.modals.stack,
  }
}

const mapDispatchToProps: DispatchedProps = {
  popModal: () => createActionEmpty(Actions.POP_MODAL),
  closeAllModal: () => createActionEmpty(Actions.CLOSE_ALL_MODAL),
}

export const ModalsStack = connect(mapStateToProps, mapDispatchToProps)(ModalsStackCmp)