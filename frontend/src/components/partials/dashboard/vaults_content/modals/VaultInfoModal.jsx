import { VerticalEllipsisIcon } from "../../../../../assets/shared";
import { PlusIcon, FingerprintIcon, UserAvatar } from "../../../../../assets/dashboard";
import { CustomCheckbox, MiniModal } from "../../../../shared";
import { CredentialInfoModal } from "../../../../index"
import NewCredentialModal from "./NewCredentialModal";
import styles from "../../../../../styles/VaultModal.module.css"; 
import { Modal } from "react-bootstrap";
import { useState } from "react";


const VaultInfoModal = ({ data, show, onHide, username }) => {
  const vaultTitle = data ? data.title : "Nome do Vault";
  const vaultId = data ? data._id : "ID do Vault";
  const [
    credentialInfoModalState, setCredentialInfoModalState
  ] = useState({visible: false, credential: undefined})
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false);
  const credentials = data ? data.credentials : [];

  const handleCredentialClick = (credential) => {
    setCredentialInfoModalState({
      visible: true,
      credential: credential
    })
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          <MiniModal
          ButtonIcon={VerticalEllipsisIcon}
          buttonClass={`${styles.ellipsisWrapper} ms-auto text-muted`}
          iconClass={styles.ellipsis}
          placement="left"
          >
            {({ closePopover, popoverItemClass}) => (
                 <>
                  <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Favoritar vault"); closePopover(e); }}>
                    Favoritar
                  </button>
                  <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Compartilhar vault"); closePopover(e); }}>
                    Compartilhar
                  </button>
                  <button type="button" 
                  className={popoverItemClass}
                  style={{color:'red'}}
                  onClick={(e) => { console.log("Excluir vault"); closePopover(e); }}>
                    Excluir
                  </button>
                </>
              )
            }
          </MiniModal>
          <Modal.Title className="mb-0 fs-3 fw-semibold">{vaultTitle}</Modal.Title>
        </div>
        
      </Modal.Header>

      <Modal.Body className={styles.scrollPanel}>
        <div className={`${styles.gridRow} ${styles.headerRow}`}>
          <div><CustomCheckbox /></div>
          <div className="fs-6" >Todos</div>
          <div className="fs-6" >Nome</div>
          <div className="fs-6" >Proprietário</div>
          <div className={styles.actionColumn}>
            <button
              type="button"
              className={styles.addCredentialBtn}
              onClick={() => setNewCredentialModalVisible(true)}
              title="Adicionar credential"
            >
              <PlusIcon style={{ width: 18, height: 18, fill:'white'}} />
            </button>
          </div>
        </div>

        <hr className="m-0" />

        {/* Conteúdo scrollável */}
        <div className={styles.panelContent}>
          {credentials.map((credential) => (
            <div className={styles.gridRow} key={credential._id} 
            onClick={() => handleCredentialClick(credential)}
            >
              <div><CustomCheckbox onClick={(e) => e.stopPropagation()}/></div>
              <div><FingerprintIcon style={{width:'20px', height:'20px'}} /></div>
              <div className={`${styles.truncate} fs-6`}>{credential.credentialTitle}</div>
              <div className={`${styles.truncate} fs-6`}>
                <div>
                  <UserAvatar style={{fill:'white'}}/>
                </div>
                {credential.credentialOwner}
                </div>
              <div></div>
            </div>
          ))}
        </div>



        <NewCredentialModal
          vaultId={vaultId}
          vaultTitle={vaultTitle}
          modalVisible={newCredentialModalVisible}
          setModalVisible={setNewCredentialModalVisible}
          credentialOwner={username}
        />

        <CredentialInfoModal
        credential={credentialInfoModalState.credential}
        modalState={credentialInfoModalState}
        setModalState={setCredentialInfoModalState}
        />


      </Modal.Body>
    </Modal>
  );
};

export default VaultInfoModal;
