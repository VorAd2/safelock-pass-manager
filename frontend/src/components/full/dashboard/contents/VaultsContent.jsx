/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultInfoModal, CredentialInfoModal, NewCredentialModal, SendVaultModal } from "../../../index"
import { useVaults } from '../../../context/useVaults'


function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [credentialInfoModalState, setCredentialInfoModalState] = useState(
    {visible: false, credential: null}
  )
  const [newCredentialModalVisible, setNewCredentialModalVisible] = useState(false)
  const [sendModalVisibleState, setSendModalVisibleState] = useState({show: false, fromVaultInfo: null})

  const [currentVaultData, setCurrentVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const { vaults, getFavorites, getShared } = useVaults()
  const [vaultsFilter, setVaultsFilter] = useState('all') 

  const getVaultData = (vaultId) => {
    for (let vault of vaults) {
      if (vault._id === vaultId) {
        return vault
      }
    }
  }

  const handleVaultClick = (vaultId) => {
    let data =  getVaultData(vaultId)
    setCurrentVaultData(data)
    setVaultInfoModalVisible(true)
  }

  const handleVaultEllpsisClick = (vaultId) => {
    setCurrentVaultData(getVaultData(vaultId))
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
          username={username}
          modalVisibleCallback={(visible) => setNewVaultModalVisible(visible)}
          vaultCardClick={(vaultId) => handleVaultClick(vaultId)}
          vaultEllipsisClick={handleVaultEllpsisClick}
          notificationHandler={notificationHandler}
          vaultsFilter={vaultsFilter}
          vaultsSubgroup={getVaultsSubgroup()}
          setSendModalVisibleState={setSendModalVisibleState}
        />

        {newVaultModalVisible && <NewVaultModal 
            onClose={onCloseNewVaultModal} 
            onCreate={onConfirmNewVaultModal}
            ownerUser={username} 
          />
        }

        <VaultInfoModal 
          data={currentVaultData} 
          username={username}
          notificationHandler={notificationHandler}
          show={vaultInfoModalVisible} 
          onHide={() => setVaultInfoModalVisible(false)}
          onNewCredentialModal={() => {setVaultInfoModalVisible(false); setNewCredentialModalVisible(true)} }
          onSendModal={() => {setVaultInfoModalVisible(false); setSendModalVisibleState({show: true, fromVaultInfo: true})} }
          onCredentialClick={(credential) => {setVaultInfoModalVisible(false); setCredentialInfoModalState({visible: true, credential})} }
        />

        <CredentialInfoModal
          modalState={credentialInfoModalState}
          setModalState={setCredentialInfoModalState}
          username={username}
          notificationHandler={notificationHandler}
          onHide={() => {setCredentialInfoModalState({visible: false, credential: null}); setVaultInfoModalVisible(true)} }
        />

        <NewCredentialModal
          vaultId={currentVaultData && currentVaultData._id}
          vaultTitle={currentVaultData && currentVaultData.title}
          modalVisible={newCredentialModalVisible}
          onHide={(added) => {
              setNewCredentialModalVisible(false);
               setTimeout(() => {
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
                document.body.classList.remove('modal-open');
                setVaultInfoModalVisible(true)
                if (added === true) {
                  notificationHandler(true, 'Credential added successfully!', 'success');
                }
              }, 200);
              
            }
          }
          credentialOwner={username}
        />        

        <SendVaultModal 
          vaultData={currentVaultData}
          username={username}
          notificationHandler={notificationHandler}
          visibleState={sendModalVisibleState}
          onHide={(fromVaultInfo) => {
              setSendModalVisibleState({show: false, fromVaultInfo: null})
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
