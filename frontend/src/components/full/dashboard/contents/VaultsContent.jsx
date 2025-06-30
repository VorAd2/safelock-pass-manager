import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultModal } from "../../../index"

function VaultsContent() {
  const [modalVisible, setModalVisible] = useState(false)
  const [vaultModalVisible, setVaultModalVisible] = useState(false)
  const [vaultData, setVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const handleVaultClick = async (vaultName) => {
    let data = await getVaultData(vaultName)
    setVaultData(data)
    setVaultModalVisible(true)
    console.log('vault clicked:', vaultName)
  }

  const getVaultData = async (vaultName) => {
    // Simulate an API call to fetch vault data
    const data = {
      vaultName: vaultName,
      ownerUsername: username,
      credentials: []
    }
    return data
  }

  const onCloseCreateModal = () => {
    setModalVisible(false)
    console.log('modal fechado')
  }

  const onCreateVault = async () => {
    onCloseCreateModal()
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
          modalVisibleCallback={(visible) => setModalVisible(visible)}
          vaultCardClick={(vaultName) => handleVaultClick(vaultName)}
        />
        {modalVisible && <NewVaultModal 
            onClose={onCloseCreateModal} 
            onCreate={onCreateVault}
            originUser={username} 
          />
        }
        <VaultModal 
          data={vaultData} 
          show={vaultModalVisible} 
          onHide={() => setVaultModalVisible(false)} 
        />

      </div>
    </div>
  );
}

export default VaultsContent;
