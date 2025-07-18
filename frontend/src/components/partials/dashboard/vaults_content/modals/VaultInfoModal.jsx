import { VerticalEllipsisIcon, CopyIcon } from "../../../../../assets/shared";
import { PlusIcon, FingerprintIcon, UserAvatar, SendIcon, StarIcon, TrashIcon, UnstarIcon } from "../../../../../assets/dashboard";
import { CustomCheckbox, MiniModal } from "../../../../shared";
import { CredentialInfoModal } from "../../../../index"
import NewCredentialModal from "./NewCredentialModal";
import styles from "../../../../../styles/VaultModal.module.css"; 
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { useVaults } from "../../../../context/useVaults";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACK_URL = import.meta.env.VITE_BACKEND_URL

const VaultInfoModal = ({ data, show, onHide, username, notificationHandler }) => {
  const vaultTitle = data ? data.title : "Nome do Vault";
  const vaultId = data ? data._id : "ID do Vault";
  const [credentialInfoModalState, setCredentialInfoModalState] = useState(
    {visible: false, credential: undefined}
  )
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false);
  const credentials = data ? data.credentials : [];
  const navigate = useNavigate();

  const { setFavoritism } = useVaults()
  const toFavorite = !(data && data.favoritedBy.some(u => u === username ))

  const handleFavoriteAction = async (e, closePopover) => {
        e.stopPropagation()
        const reqData = {
            toFavorite: toFavorite,
            vaultId: data._id,
            username: username
        }
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        try {
            await axios.patch(`${BACK_URL}/dashboard/vaults/favoritism`, reqData,
                { headers: {Authorization: `Bearer ${authToken}` }}
            )
            setFavoritism(vaultTitle, username, toFavorite)
            const message = toFavorite
                ? 'Vault favorited successfully'
                : 'Vault unfavorited successfully'
            notificationHandler(true, message, 'success')
        } catch (err) {
            console.warn(`Erro no favoritismo: ${err}`)
        } finally {
            closePopover(e)
        }
    }

  const handleCredentialClick = (credential) => {
    setCredentialInfoModalState({
      visible: true,
      credential: credential
    })
  }

  const handleCredentialCopy = async (field) => {
    try {
      await navigator.clipboard.writeText(field)
    } catch (err) {
      alert(`Erro ao copiar campo: ${err.message}`)
    }
  }


  function getVaultEllipsisModal() {
    return (
      <MiniModal
        ButtonIcon={VerticalEllipsisIcon}
        buttonClass={`${styles.ellipsisWrapper} ms-auto text-muted`}
        iconClass={styles.ellipsis}
        placement="left"
        >
          {({ closePopover, popoverItemClass}) => (
              <>
                <button type="button" className={popoverItemClass} onClick={(e) => handleFavoriteAction(e, closePopover)}>
                  <div className="d-flex align-items-center">
                    {toFavorite ? <StarIcon className='me-2'/> : <UnstarIcon className='me-2'/>}
                    
                    <span>{toFavorite ? 'Favorite' : 'Unfavorite'}</span>
                  </div>
                </button>
                <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Compartilhar vault"); closePopover(e); }}>
                  <div className="d-flex align-items-center">
                    <SendIcon className='me-2'/>
                    <span>Share</span>
                  </div>
                </button>
                <button type="button" 
                className={popoverItemClass}
                style={{color:'var(--red-color)', fill:'var(--red-color)'}}
                onClick={(e) => { console.log("Excluir vault"); closePopover(e); }}>
                  <div className="d-flex align-items-center">
                    <TrashIcon className='me-2'/>
                    <span>Delete</span>
                  </div>
                </button>
              </>
            )
          }
        </MiniModal>
    )
  }

  function getCredentialEllipsisModal(credential) {
    const email = credential.credentialEmail
    const password = credential.credentialPassword
    const username = credential.credentialUsername
    return (
      <MiniModal
      ButtonIcon={VerticalEllipsisIcon}
      buttonClass={styles.credentialEllipsisWrapper}
      placement="right"
      >
        {({ closePopover, popoverItemClass}) => (
            <>
              <button type="button" className={popoverItemClass} onClick={(e) => {handleCredentialCopy(email); closePopover(e); }}>
                <div className="d-flex align-items-center">
                  <CopyIcon className='me-2'/>
                  <span>Copy email</span>
                </div>
              </button>
              <button type="button" className={popoverItemClass} onClick={(e) => {handleCredentialCopy(password); closePopover(e); }}>
                <div className="d-flex align-items-center">
                  <CopyIcon className='me-2'/>
                  <span>Copy password</span>
                </div>
              </button>
              <button type="button" className={popoverItemClass} onClick={(e) => {handleCredentialCopy(username); closePopover(e); }}>
                <div className="d-flex align-items-center fs-9">
                  <CopyIcon className='me-2'/>
                  <span>Copy username</span>
                </div>
              </button>
              <button type="button" className={popoverItemClass} onClick={(e) => { console.log("Excluir credential"); closePopover(e); }}>
                <div className="d-flex align-items-center ">
                  <TrashIcon className='me-2' style={{fill:'var(--red-color)'}}/>
                  <span style={{color:'var(--red-color)'}}>Delete</span>
                </div>
              </button>
            </>
          )
        }
      </MiniModal>
    )
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          {getVaultEllipsisModal()}
          <Modal.Title className="mb-0 fs-3 fw-semibold">{vaultTitle}</Modal.Title>
        </div> 
      </Modal.Header>

      <Modal.Body className={styles.scrollPanel}>
        <div className={`${styles.gridRow} fw-bold`}>
          <div><CustomCheckbox /></div>
          <div className="fs-6" >All</div>
          <div className="fs-6" >Title</div>
          <div className="fs-6" >Owner</div>
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
              <div className={styles.actionColumn}>
                {getCredentialEllipsisModal(credential)}
              </div>
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
