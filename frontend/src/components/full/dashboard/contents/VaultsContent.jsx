import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultInfoModal, SendVaultModal } from "../../../index"
import { useVaults } from '../../../context/useVaults'
import { useEffect } from 'react'

function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [sendModalVisible, setSendModalVisible] = useState(false)

  const [currentVaultData, setCurrentVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const { vaults, getFavorites, getShared } = useVaults()
  const [vaultsFilter, setVaultsFilter] = useState('all') 

  const getVaultData = (vaultTitle) => {
    for (let vault of vaults) {
      if (vault.title === vaultTitle) {
        return vault
      }
    }
  }

  const handleVaultClick = (vaultTitle) => {
    let data =  getVaultData(vaultTitle)
    setCurrentVaultData(data)
    setVaultInfoModalVisible(true)
  }

  const handleVaultEllpsisClick = (vaultTitle) => {
    setCurrentVaultData(getVaultData(vaultTitle))
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
    console.log(`Vaults favoritos: ${JSON.stringify(getFavorites(username), null, 2)}`)
  }, [vaults])


  const onCloseNewVaultModal = () => {
    setNewVaultModalVisible(false)
  }

  const onConfirmNewVaultModal = async () => {
    onCloseNewVaultModal()
    notificationHandler(true, 'Vault criado com sucesso!', 'success')
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
        vaultCardClick={(vaultName) => handleVaultClick(vaultName)}
        vaultEllipsisClick={handleVaultEllpsisClick}
        notificationHandler={notificationHandler}
        vaultsFilter={vaultsFilter}
        vaultsSubgroup={getVaultsSubgroup()}
        setSendModalVisible={setSendModalVisible}
        />
        {newVaultModalVisible && <NewVaultModal 
            onClose={onCloseNewVaultModal} 
            onCreate={onConfirmNewVaultModal}
            ownerUser={username} 
          />
        }
        <VaultInfoModal 
        data={currentVaultData} 
        show={vaultInfoModalVisible} 
        onHide={() => setVaultInfoModalVisible(false)}
        username={username}
        notificationHandler={notificationHandler}
        setSendModalVisible={setSendModalVisible} 
        />

        <SendVaultModal 
        show={sendModalVisible}
        setSendModalVisible={setSendModalVisible}
        vaultData={currentVaultData}
        username={username}
        />

      </div>
    </div>
  );
}

export default VaultsContent;
