import { useVaults } from "../../../../context/useVaults";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { VerticalEllipsisIcon, CopyIcon, RemoveIcon } from "../../../../../assets/shared";
import { PlusIcon, FingerprintIcon, UserAvatar, SendIcon, StarIcon, TrashIcon, UnstarIcon } from "../../../../../assets/dashboard";
import { CustomCheckbox, MiniModal } from "../../../../shared";
import styles from "../../../../../styles/VaultModal.module.css"; 
import backCodes from "../../../../../back_codes";

const BACK_URL = import.meta.env.VITE_BACKEND_URL


const VaultInfoModal = ({ data, username, notificationHandler, show, onHide, onCredentialClick, onNewCredentialModal, onSendModal }) => {
  data = data ?? {title: '', _id: '', credentials: [], favoritedBy: [], sharedUsers: [], ownerUser: ''}
  const vaultTitle = data.title;
  const vaultId = data._id;
  const credentials = data ? data.credentials : [];
  const navigate = useNavigate();
  const { setFavoritism, deleteVault, deleteCredential } = useVaults()
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
            setFavoritism(vaultId, username, toFavorite)
            const message = toFavorite
                ? 'Vault favorited successfully'
                : 'Vault unfavorited successfully'
            notificationHandler(true, message, 'success')
        } catch (err) {
            notificationHandler(true, 'Unknown error. Please, try again', 'success')
            console.warn(`Erro no favoritismo: ${err}`)
        } finally {
            closePopover(e)
        }
    }

  const handleCredentialCopy = async (field) => {
    try {
      await navigator.clipboard.writeText(field)
    } catch (err) {
      alert(`Error copying field: ${err.message}`)
    }
  }

  const handleSendAction = (e, closePopover) => {
    closePopover(e)
    onSendModal()
  }

  const handleVaultDelete = async (e, closePopover) => {
        e.stopPropagation()
        try {
            let authToken = localStorage.getItem('authToken')
            if (!authToken) {
                console.warn("No token found. Redirecting to signin.");
                navigate("/signin");
                return;
            }
            const route = `${BACK_URL}/dashboard/vaults`
            const config = {
                headers: { Authorization: `Bearer ${authToken}` },
                data: {
                    ownerUsername: data.ownerUser,
                    vaultId: vaultId,
                    vaultTitle
                }
            }
            await axios.delete(route, config)
            deleteVault(vaultId)
            notificationHandler(true, 'Vault deleted successfully', 'success')
        } catch (err) {
            notificationHandler(true, 'Unknown error. Please, try again', 'error')
            console.warn(`Erro ao deletar vault: ${err}`)
        } finally {
            closePopover(e)
            onHide()
        }   
  }

  const handleRemoveSharing = (e, closePopover) => {
        e.stopPropagation()
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
            console.warn("No token found. Redirecting to signin.");
            navigate("/signin");
            return;
        }
        const route = `${BACK_URL}/dashboard/vaults/sharing`
        const config = {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                vaultId: data._id,
                username
            }
        }
        axios.delete(route, config)
            .then(() => {
                deleteVault(data._id)
                notificationHandler(true, 'Vault sharing removed successfully', 'success')
            })
            .catch(err => {
                if (err.response && err.response.data.code === backCodes.VAULT_SHARING_NOT_FOUND) {
                    notificationHandler(true, 'Vault sharing not found. Please, try again or verify your vaults', 'error')
                } else {
                    notificationHandler(true, 'Unknown error. Please, try again', 'error')
                    console.warn(`Erro ao remover compartilhamento de vault: ${err}`)
                }
            })
            .finally(() => { 
                closePopover(e)
                onHide()
            })
    }

  function getVaultEllipsisModal() {
    const canShareVault = !(data.sharedUsers.some(u => u === username))
    const sendSpanStyle = canShareVault ? '' : 'text-decoration-line-through text-secondary'
    const canDeleteVault = data.ownerUser === username
    const noHoverClassSend = canShareVault ? '' : 'noHoverClass'
    const exclusionStyle = canDeleteVault 
            ? {color: 'var(--red-color)', fill: 'var(--red-color)'}
            : {color: 'var(--action-yellow-color)', fill: 'var(--action-yellow-color)'}
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
                <button type="button" 
                className={`${popoverItemClass} ${noHoverClassSend}`} 
                onClick={
                  (e) => {
                    e.stopPropagation()
                    if (canShareVault) handleSendAction(e, closePopover); 
                  }
                }
                style={{cursor: canShareVault ? 'pointer' : 'not-allowed'}}
                >
                  <div className="d-flex align-items-center">
                    <SendIcon className={`me-2 ${sendSpanStyle}`}/>
                    <span className={sendSpanStyle}>Share</span>
                  </div>
                </button>
                <button type="button" 
                            className={popoverItemClass}
                            onClick={
                                (e) => {
                                    e.stopPropagation()
                                    if (canDeleteVault) {
                                        handleVaultDelete(e, closePopover)
                                    } else {
                                        handleRemoveSharing(e, closePopover)
                                    }
                                }
                            }
                            >
                                <div className={`d-flex align-items-center`} style={exclusionStyle}>
                                    {canDeleteVault ? <TrashIcon className='me-2'/> : <RemoveIcon className='me-2'/>}
                                    <span>{canDeleteVault ? 'Delete' : 'Unlink'}</span>
                                </div>
                            </button>
              </>
            )
          }
        </MiniModal>
    )
  }

  const handleCredentialDelete = async (e, credential, closePopover) => {
    e.stopPropagation()
    try {
      let authToken = localStorage.getItem('authToken')
      if (!authToken) {
        console.warn("No token found. Redirecting to signin.");
        navigate("/signin");
        return;
      }
      const route = `${BACK_URL}/dashboard/vaults/credentials`
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
        data: {
          vaultId,
          vaultTitle,
          credential,
          username
        }
      }
      const response = await axios.delete(route, config)
      deleteCredential(vaultId, credential)
      closePopover(e)
      notificationHandler(true, response.data.message, 'success')
    } catch (err) {
      if (err.response && err.response.data.code === backCodes.CREDENTIAL_ACCESS_DENIED) {
        const msg = err.response.data.message
        alert(msg)
      } else {
        alert('Unknown error. Please, try again')
        console.warn(`Erro desconhecido ao deletar credencial: ${err}`)
      }
    }
  }

  function getCredentialEllipsisModal(credential) {
    const email = credential.credentialEmail
    const password = credential.credentialPassword
    const canDeleteCredential = username === credential.credentialOwner
    const deleteSpanStyle = canDeleteCredential ? '' : 'text-decoration-line-through text-secondary'
    const noHoverClassDelete = canDeleteCredential ? '' : 'noHoverClass'
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
              <button type="button" className={popoverItemClass} onClick={(e) => {handleCredentialCopy(credential.credentialOwner); closePopover(e); }}>
                <div className="d-flex align-items-center fs-9">
                  <CopyIcon className='me-2'/>
                  <span>Copy username</span>
                </div>
              </button>
              <button type="button" 
              className={`${popoverItemClass} text-danger ${noHoverClassDelete}`} 
              onClick={(e) => { e.stopPropagation(); if (canDeleteCredential) handleCredentialDelete(e, credential, closePopover) }}
              style={{cursor: canDeleteCredential ? 'pointer' : 'not-allowed'}}
              >
                <div className='d-flex align-items-center'>
                  <TrashIcon className={`me-2 ${deleteSpanStyle}`}/>
                  <span className={deleteSpanStyle}>Delete</span>
                </div>
              </button>
            </>
          )
        }
      </MiniModal>
    )
  }

  const handleClose = () => {
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          {getVaultEllipsisModal()}
          <Modal.Title className="mb-0 me-3 fs-3 fw-semibold">{vaultTitle}</Modal.Title>
          <div className="d-flex align-items-center">
            <UserAvatar className={styles.userAvatar}/>
            {data.ownerUser}
          </div>
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
              onClick={() => onNewCredentialModal()}
              title="Adicionar credential"
            >
              <PlusIcon style={{ width: 18, height: 18, fill:'white'}} />
            </button>
          </div>
        </div>

        <hr className="m-0" />

        <div className={styles.panelContent}>
          {credentials.map((credential) => (
            <div className={styles.gridRow} key={credential._id} 
            onClick={() => onCredentialClick(credential)}
            >
              <div><CustomCheckbox onClick={(e) => e.stopPropagation()}/></div>
              <div><FingerprintIcon style={{width:'20px', height:'20px'}} /></div>
              <div className={`${styles.truncate} fs-6`}>{credential.credentialTitle}</div>
              <div className={`${styles.truncate} fs-6`}>
                <div>
                  <UserAvatar className={styles.userAvatar}/>
                </div>
                {credential.credentialOwner}
              </div>
              <div className={styles.actionColumn}>
                {getCredentialEllipsisModal(credential)}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VaultInfoModal;
