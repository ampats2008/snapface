import { useCallback, useMemo, useState, useReducer, Reducer } from 'react'
import { createContainer } from 'react-tracked'

type SnackbarState = {
  type: 'LOADING' | 'FAILED' | 'SUCCESS' | 'IDLE'
  payload: {
    message: string
    duration?: number
  } | null
}

const initialState: {
  snackBarState: SnackbarState
} = {
  snackBarState: {
    type: 'IDLE',
    payload: null,
  },
}

type actionTypes =
  | 'snackReset'
  | 'snackSuccess'
  | 'snackFailure'
  | 'snackLoading'

const globalStateReducer: Reducer<
  typeof initialState,
  { type: actionTypes; payload?: any }
> = (state, action) => {
  switch (action.type) {
    case 'snackReset':
      return {
        ...state,
        snackBarState: {
          type: 'IDLE',
          payload: null,
        },
      }
    case 'snackSuccess':
      return {
        ...state,
        snackBarState: {
          type: 'SUCCESS',
          payload: action.payload,
        },
      }
    case 'snackFailure':
      return {
        ...state,
        snackBarState: {
          type: 'FAILED',
          payload: action.payload,
        },
      }
    case 'snackLoading':
      return {
        ...state,
        snackBarState: {
          type: 'LOADING',
          payload: action.payload,
        },
      }
    default:
      console.error('Action not found!')
      return state
  }
}

const useMyState = () => useReducer(globalStateReducer, initialState)

export const { Provider: GlobalStateProvider, useTracked: useGlobalState } = createContainer(useMyState) // prettier-ignore
