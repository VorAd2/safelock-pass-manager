import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultInfoModal } from "../../../index"
import { useVaults } from '../../../context/useVaults'
import { useEffect } from 'react'

function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [currentVaultData, setCurrentVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const { vaults } = useVaults() 

  const handleVaultClick = (vaultTitle) => {
    const getVaultData = (vaultTitle) => {
      for (let vault of vaults) {
        if (vault.title === vaultTitle) {
          return vault
        }
      }
    }
    let data =  getVaultData(vaultTitle)
    setCurrentVaultData(data)
    setVaultInfoModalVisible(true)
    console.log('vault clicked:', vaultTitle)
  }

  useEffect(() => {
    if (currentVaultData && vaults.length > 0) {
      const updated = vaults.find(v => v._id === currentVaultData._id)
      if (updated) setCurrentVaultData(updated)
    }
  }, [vaults])


  const onCloseNewVaultModal = () => {
    setNewVaultModalVisible(false)
    console.log('modal fechado')
  }

  const onConfirmNewVaultModal = async () => {
    onCloseNewVaultModal()
    notificationHandler(true, 'Vault criado com sucesso!', 'success')
    console.log('vault criado')
  }

  return (
    <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
      <div className="p-3" style={{ width: '25%', minWidth: '250px' }}>
        <FloatingBox />
      </div>

      <div className="p-3 flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        <VaultPanel 
          username={username}
          modalVisibleCallback={(visible) => setNewVaultModalVisible(visible)}
          vaultCardClick={(vaultName) => handleVaultClick(vaultName)}
        />
        {newVaultModalVisible && <NewVaultModal 
            onClose={onCloseNewVaultModal} 
            onCreate={onConfirmNewVaultModal}
            originUser={username} 
          />
        }
        <VaultInfoModal 
          data={currentVaultData} 
          show={vaultInfoModalVisible} 
          onHide={() => setVaultInfoModalVisible(false)}
          username={username} 
        />

      </div>
    </div>
  );
}

export default VaultsContent;
