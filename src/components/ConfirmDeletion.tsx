import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

interface DeleteProps {
  removeCertificate: (domain: string) => void;
  domain: string;
}

export const ConfirmDeletion: React.FunctionComponent<DeleteProps> = ({ removeCertificate: removeRemoveCertificate, domain }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmDeletion = (_event: KeyboardEvent | React.MouseEvent) => {
    removeRemoveCertificate(domain);
    handleModalToggle(_event);
  }

  return (
    <React.Fragment>
      <Button variant="danger" onClick={handleModalToggle}>
        Delete
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Confirm deletion"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="danger" onClick={confirmDeletion}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Are you sure you want to delete this ACME certificate? This action is not reversible!
      </Modal>
    </React.Fragment>
  );
};
