import backCodes from '../../../../back_codes'
import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  FloatingBox, VaultPanel, NewVaultModal, VaultTitleChangeModal, VaultPinModal,
  VaultInfoModal, CredentialInfoModal, NewCredentialModal, SendVaultModal
} from "../../../index"
import { useVaults } from '../../../context/useVaults'
import { fetchDataService } from '../../../../services/dashboardService'


function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultPinModalVisible, setVaultPinModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [credentialInfoModalState, setCredentialInfoModalState] = useState(
    { visible: false, credential: null }
  )
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false)
  const [sendModalVisibleState, setSendModalVisibleState] = useState({ visible: false, fromVaultInfoModal: null })
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
    let data = getVaultData(vaultId)
    setCurrentVaultData(data)
    if (data.pin) {
      setVaultPinModalVisible(true)
      return
    }
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
      const response = await fetchDataService(authToken, username)
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

  const onCloseNewVaultModal = () => {
    setNewVaultModalVisible(false)
  }

  const onConfirmNewVaultModal = async () => {
    onCloseNewVaultModal()
    notificationHandler(true, 'Vault created successfully!', 'success')
  }

  useEffect(() => {
    if (currentVaultData && vaults.length > 0) {
      const updated = vaults.find(v => v._id === currentVaultData._id)
      if (updated) setCurrentVaultData(updated)
    }
  }, [vaults])


  return (
    <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
      <aside className="p-3" style={{ width: '25%', minWidth: '250px' }}>
        <FloatingBox setVaultsFilter={setVaultsFilter} />
      </aside>
      <section className='p-3 flex-grow-1 d-flex flex-column' style={{ minHeight: 0 }}>
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

        {vaultPinModalVisible && <VaultPinModal
          onHide={(isCorrect) => {
            setVaultPinModalVisible(false)
            if (isCorrect) setVaultInfoModalVisible(true)
          }}
          pin={currentVaultData.pin}
        />
        }

        {vaultInfoModalVisible && <VaultInfoModal
          data={currentVaultData}
          notificationHandler={notificationHandler}
          onHide={() => setVaultInfoModalVisible(false)}
          onVaultTitleClick={() => { setVaultInfoModalVisible(false); setVaultTitleChangeVisible(true) }}
          onNewCredentialModal={() => { setVaultInfoModalVisible(false); setNewCredentialModalVisible(true) }}
          onSendModal={() => { setVaultInfoModalVisible(false); setSendModalVisibleState({ visible: true, fromVaultInfoModal: true }) }}
          onCredentialClick={(credential) => { setVaultInfoModalVisible(false); setCredentialInfoModalState({ visible: true, credential }) }}
        />
        }

        {newCredentialModalVisible && <NewCredentialModal
          vaultId={currentVaultData && currentVaultData._id}
          vaultTitle={currentVaultData && currentVaultData.title}
          onHide={(added) => {
            setNewCredentialModalVisible(false)
            setVaultInfoModalVisible(true)
            if (added === true) {
              notificationHandler(true, 'Credential added successfully!', 'success')
            }
          }
          }
        />
        }
        {credentialInfoModalState.visible && <CredentialInfoModal
          credential={credentialInfoModalState.credential}
          vault={currentVaultData}
          notificationHandler={notificationHandler}
          onHide={() => { setCredentialInfoModalState({ visible: false, credential: null }); setVaultInfoModalVisible(true) }}
        />
        }
        {sendModalVisibleState.visible && <SendVaultModal
          vaultData={currentVaultData}
          notificationHandler={notificationHandler}
          fromVaultInfo={sendModalVisibleState.fromVaultInfoModal}
          onHide={(fromVaultInfo) => {
            setSendModalVisibleState({ visible: false, fromVaultInfoModal: null })
            if (fromVaultInfo) setVaultInfoModalVisible(true);
          }
          }
        />
        }
      </section>
    </div>
  )
}

export default VaultsContent;
