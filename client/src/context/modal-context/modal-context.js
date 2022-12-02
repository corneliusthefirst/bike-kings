/* eslint-disable react/react-in-jsx-scope */
import React, { createContext, useContext, useState } from 'react'
import Modal from '../../components/shared/Modal'

const defaultValues = {
  visible: false,
  showModal: () => {},
  hideModal: () => {},
  modalContent: <div />,
}

const ModalContext = createContext(defaultValues)

export const useModal = () => {
  const state = useContext(ModalContext)
  return state
}

const { Provider } = ModalContext

function ModalProvider({ children }) {
  const [state, setState] = useState({
    visible: false,
    center: false,
    big: false,
  })
  const [modalContent, setModalContent] = useState()
  function showModal(body, center, big) {
    setState({ ...state, visible: true, center: center, big: big })
    if (body) {
      setModalContent(body)
    }
  }
  function hideModal() {
    setState({ ...state, visible: false })
  }

  return (
    <Provider
      value={{ visible: state.visible, showModal, hideModal, modalContent }}
    >
      <Modal
        onClose={hideModal}
        show={state.visible}
        center={state.center}
        big={state.big}
      >
        {modalContent}
      </Modal>
      {children}
    </Provider>
  )
}

export { ModalContext, ModalProvider, Modal }
