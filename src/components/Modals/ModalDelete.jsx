import React from 'react';
import { Box } from '@mui/material';
import CenteredModal from './CenteredModal';
import { useModalStore } from '../../store';
import useApi from '../../hooks/useApi';
import ModalColumnTitle from './components/ModalColumnTitle';
import CustomButton from '../Button';

function ModalDeleteContainer({ setModalStore, modalStore }) {
  const {
    deleteModal: {
      id, callback, message, deleteRequest, objectName = 'Object', setter,
    },
  } = modalStore;

  const closeDeleteModal = () => {
    setModalStore({
      ...modalStore,
      deleteModal: { isOpen: false },
    });
  };

  const onDelete = async () => {
    await deleteRequest(id);

    if (callback) await callback();

    closeDeleteModal();
  };

  const { makeRequest } = useApi({
    request: onDelete,
    successMessage: message,
    setter,
  });

  return (
    <CenteredModal close={closeDeleteModal} containerSx={{ width: 'fit-content', p: '40px', borderRadius: '16px' }} open>
      <ModalColumnTitle>
        Are you sure you want to delete
        {' '}
        {objectName}
        ?
      </ModalColumnTitle>
      <Box display="flex" justifyContent="center" gap={2} mt="40px">
        <CustomButton variant="contained" onClick={closeDeleteModal}>No, I Dont</CustomButton>
        <CustomButton variant="contained" color="error" onClick={makeRequest}>Yes, Delete</CustomButton>
      </Box>
    </CenteredModal>
  );
}

export default function ModalDelete() {
  const { modalStore, setModalStore } = useModalStore();

  if (!modalStore?.deleteModal?.isOpen) return null;

  return <ModalDeleteContainer modalStore={modalStore} setModalStore={setModalStore} />
}