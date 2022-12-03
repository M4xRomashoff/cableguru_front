import { useModalStore } from '../store';

export default function useDeleteModal() {
  const { modalStore, setModalStore } = useModalStore();

  return ({
    itemId, message, objectName, deleteItem, setter,
  }) => {
    setModalStore({
      ...modalStore,
      deleteModal: {
        isOpen: true,
        objectName,
        deleteRequest: () => deleteItem(itemId),
        setter,
        id: itemId,
        message,
      },
    });
  };
}
