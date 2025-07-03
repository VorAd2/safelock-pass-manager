import { VerticalEllipsisIcon } from "../../../../../assets/shared";
import { PlusIcon, FingerprintIcon } from "../../../../../assets/dashboard";
import CustomCheckbox from "../../../../shared/CustomCheckbox";
import NewCredentialModal from "./NewCredentialModal";
import styles from "../../../../../styles/VaultModal.module.css"; 
import { Modal } from "react-bootstrap";
import { useState } from "react";


const VaultInfoModal = ({ data, show, onHide, username }) => {
  const vaultTitle = data ? data.title : "Nome do Vault";
  const vaultId = data ? data._id : "ID do Vault";
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false);
  const credentials = data ? data.credentials : [];

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
          {credentials.map((credential) => (
            <div className={styles.gridRow} key={credential._id}>
            <div><CustomCheckbox /></div>
            <div><FingerprintIcon /></div>
            <div className={styles.truncate}>{credential.credentialTitle}</div>
            <div className={styles.truncate}>{credential.credentialOwner}</div>
            <div></div>
          </div>
          ))}
        </div>



        {/* Modal para adicionar credential */}
        <NewCredentialModal
          vaultId={vaultId}
          vaultTitle={vaultTitle}
          modalVisible={newCredentialModalVisible}
          setModalVisible={setNewCredentialModalVisible}
          credentialOwner={username}
        />


      </Modal.Body>
    </Modal>
  );
};

export default VaultInfoModal;
