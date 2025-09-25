/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import backCodes from '../../../../back_codes'
import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultTitleChangeModal, VaultInfoModal, CredentialInfoModal, NewCredentialModal, SendVaultModal } from "../../../index"
import { useVaults } from '../../../context/useVaults'

const backUrl = import.meta.env.VITE_BACKEND_URL;


function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [credentialInfoModalState, setCredentialInfoModalState] = useState(
    {visible: false, credential: null}
  )
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false)
  const [sendModalVisibleState, setSendModalVisibleState] = useState({show: false, fromVaultInfoModal: null})
  const [vaultTitleChangeModalVisible, setVaultTitleChangeVisible] = useState(false)

  const [currentVaultData, setCurrentVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { vaults, setAllVaults, getFavorites, getShared } = useVaults()
  const [vaultsFilter, setVaultsFilter] = useState('all') 

  const getVaultData = (vaultId) => {
    for (let vault of vaults) {
      if (vault._id === vaultId) {
        return vault
      }
    }
  }

  const handleVaultClick = (vaultId) => {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      alert('No token found. Redirecting...')
      navigate('/signin')
      return
    }
    let data =  getVaultData(vaultId)
    setCurrentVaultData(data)
    setVaultInfoModalVisible(true)
  }

  const handleVaultEllpsisClick = (vaultId) => {
    setCurrentVaultData(getVaultData(vaultId))
  }

  const refreshVaults = async () => {
    console.log('refresh vaults')
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      alert("Access denied or session expired. Please, log in again.")
      navigate("/signin")
      return
    }
    setIsRefreshing(true)
    try {
      const config = {headers: {Authorization: `Bearer ${authToken}`}}
      const response = await axios.get(`${backUrl}/dashboard/${username}`, config)
      setAllVaults(response.data)
      setIsRefreshing(false)
    } catch (err) {
      if (err.response && err.response.data.code === backCodes.ACCESS_DENIED) {
        alert("Access denied or session expired. Please, log in again.")
        localStorage.removeItem("authToken")
        navigate("/signin");
      } else if (err.response && err.response.status === 204) {
        console.log("Nenhum vault encontrado para este usuário.")
        setAllVaults([])
      } else {
        alert("Ocorreu um erro ao carregar os dados do cofre.")
      }
    }
  }

  function getVaultsSubgroup() {
    switch (vaultsFilter) {
      case 'all':
        return vaults
      case 'favs':
        return getFavorites(username)
      case 'shared':
        return getShared()
      default:
        return []
    }
  }

  useEffect(() => {
    if (currentVaultData && vaults.length > 0) {
      const updated = vaults.find(v => v._id === currentVaultData._id)
      if (updated) setCurrentVaultData(updated)
    }
  }, [vaults])


  const onCloseNewVaultModal = () => {
    setNewVaultModalVisible(false)
  }

  const onConfirmNewVaultModal = async () => {
    onCloseNewVaultModal()
    notificationHandler(true, 'Vault created successfully!', 'success')
  }


  return (
    <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
      <div className="p-3" style={{ width: '25%', minWidth: '250px' }}>
        <FloatingBox setVaultsFilter={setVaultsFilter} />
      </div>
      <div className='p-3 flex-grow-1 d-flex flex-column' style={{ minHeight: 0 }}>
        <VaultPanel 
          modalVisibleCallback={(visible) => setNewVaultModalVisible(visible)}
          vaultCardClick={(vaultId) => handleVaultClick(vaultId)}
          vaultEllipsisClick={handleVaultEllpsisClick}
          notificationHandler={notificationHandler}
          vaultsFilter={vaultsFilter}
          vaultsSubgroup={getVaultsSubgroup()}
          setSendModalVisibleState={setSendModalVisibleState}
          refreshVaults={refreshVaults}
          isRefreshing={isRefreshing}
        />
        {/** Replicar a forma de redenrização abaixo */}
        {newVaultModalVisible && <NewVaultModal 
            onClose={onCloseNewVaultModal} 
            onCreate={onConfirmNewVaultModal}
          />
        }
        {vaultTitleChangeModalVisible && <VaultTitleChangeModal
          data={currentVaultData}
          onHide={(changed) => {
              setVaultTitleChangeVisible(false)
              setVaultInfoModalVisible(true)
              if (changed === true) {
                notificationHandler(true, 'Title changed successfully!', 'success')
              }
            }
          }
          />
        }
        <VaultInfoModal 
          data={currentVaultData} 
          notificationHandler={notificationHandler}
          show={vaultInfoModalVisible} 
          onHide={() => setVaultInfoModalVisible(false)}
          onVaultTitleClick={() => {setVaultInfoModalVisible(false); setVaultTitleChangeVisible(true)}}
          onNewCredentialModal={() => {setVaultInfoModalVisible(false); setNewCredentialModalVisible(true)} }
          onSendModal={() => {setVaultInfoModalVisible(false); setSendModalVisibleState({show: true, fromVaultInfo: true})} }
          onCredentialClick={(credential) => {setVaultInfoModalVisible(false); setCredentialInfoModalState({visible: true, credential})} }
        />
        
        <NewCredentialModal
          vaultId={currentVaultData && currentVaultData._id}
          vaultTitle={currentVaultData && currentVaultData.title}
          modalVisible={newCredentialModalVisible}
          onHide={(added) => {
              setNewCredentialModalVisible(false)
              setTimeout(() => {
                const backdrop = document.querySelector('.modal-backdrop')
                if (backdrop) backdrop.remove()
                document.body.classList.remove('modal-open')
                setVaultInfoModalVisible(true)
                if (added === true) {
                  notificationHandler(true, 'Credential added successfully!', 'success')
                }
              }, 200);
            }
          }
        /> 
        <CredentialInfoModal
          modalState={credentialInfoModalState}
          setModalState={setCredentialInfoModalState}
          notificationHandler={notificationHandler}
          onHide={() => {setCredentialInfoModalState({visible: false, credential: null}); setVaultInfoModalVisible(true)} }
        />
        <SendVaultModal 
          vaultData={currentVaultData}
          notificationHandler={notificationHandler}
          visibleState={sendModalVisibleState}
          onHide={(fromVaultInfo) => {
              setSendModalVisibleState({show: false, fromVaultInfoModal: null})
              setTimeout(() => {
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
                document.body.classList.remove('modal-open');
                if (fromVaultInfo) setVaultInfoModalVisible(true);
              }, 200);
            } 
          }
        />
      </div>
    </div>
  );
}

export default VaultsContent;
