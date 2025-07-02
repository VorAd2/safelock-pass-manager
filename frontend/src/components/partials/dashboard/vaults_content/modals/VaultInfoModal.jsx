import { VerticalEllipsisIcon } from "../../../../../assets/shared";
import { PlusIcon, FingerprintIcon } from "../../../../../assets/dashboard";
import CustomCheckbox from "../../../../shared/CustomCheckbox";
import NewCredentialModal from "./NewCredentialModal";
import styles from "../../../../../styles/VaultModal.module.css"; 
import { Modal } from "react-bootstrap";


import { useState } from "react";

const VaultInfoModal = ({ data, show, onHide, username }) => {
  const vaultTitle = data ? data.vaultTitle : "Nome do Vault";
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          <div className={`ms-auto text-muted ${styles.vaultOptions}`} style={{ cursor: "pointer" }}>
            <VerticalEllipsisIcon/>
          </div>
          <Modal.Title className="mb-0">{vaultTitle}</Modal.Title>
        </div>
        
      </Modal.Header>

      <Modal.Body className={styles.scrollPanel}>
        {/* Cabeçalho do painel */}
        <div className={`${styles.gridRow} ${styles.headerRow}`}>
          <div><CustomCheckbox /></div>
          <div>Todos</div>
          <div>Nome</div>
          <div>Proprietário</div>
          <div className={styles.actionColumn}>
            <button
              type="button"
              className={styles.addCredentialBtn}
              onClick={() => setNewCredentialModalVisible(true)}
              title="Adicionar credential"
            >
              <PlusIcon style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        <hr className="m-0" />

        {/* Conteúdo scrollável */}
        <div className={styles.panelContent}>
          <div className={styles.gridRow}>
            <div><CustomCheckbox /></div>
            <div><FingerprintIcon /></div>
            <div className={styles.truncate}>LLLLLLLLLLLLLLLLLLLL</div>
            <div className={styles.truncate}>Rayla</div>
            <div></div>
          </div>
        </div>



        {/* Modal para adicionar credential */}
        <NewCredentialModal
          modalVisible={newCredentialModalVisible}
          setModalVisible={setNewCredentialModalVisible}
          owner={username}
        />


      </Modal.Body>
    </Modal>
  );
};

export default VaultInfoModal;
