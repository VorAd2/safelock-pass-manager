import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal, VaultInfoModal } from "../../../index"
import axios from 'axios'

const backUrl = import.meta.env.VITE_BACKEND_URL

function VaultsContent() {
  const [newVaultModalVisible, setNewVaultModalVisible] = useState(false)
  const [vaultInfoModalVisible, setVaultInfoModalVisible] = useState(false)
  const [currentVaultData, setCurrentVaultData] = useState(null)
  const { username, notificationHandler } = useOutletContext()

  const handleVaultClick = async (vaultTitle) => {
    const getVaultData = async (vaultTitle) => {
      const response = await axios.get(`${backUrl}/dashboard/vaults/${username}/${vaultTitle}`)
      return response.data
    }

    let data = await getVaultData(vaultTitle)
    setCurrentVaultData(data)
    setVaultInfoModalVisible(true)
    console.log('vault clicked:', vaultTitle)
  }


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
