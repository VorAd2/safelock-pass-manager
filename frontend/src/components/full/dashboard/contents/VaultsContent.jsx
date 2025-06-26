import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FloatingBox, VaultPanel, NewVaultModal } from "../../../index"

function VaultsContent() {
  const [modalVisible, setModalVisible] = useState(false)
  const { username, notificationHandler } = useOutletContext()

  const onCloseModal = () => {
    setModalVisible(false)
    console.log('modal fechado')
  }

  const onCreateVault = async () => {
    onCloseModal()
    notificationHandler(true, 'Vault criado com sucesso!', 'success')
    console.log('vault criado')
  }

  return (
    <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
      <div className="p-3" style={{ width: '25%', minWidth: '250px' }}>
        <FloatingBox />
      </div>

      <div className="p-3 flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        <VaultPanel modalVisibleCallback={(visible) => setModalVisible(visible)}/>
        {modalVisible && <NewVaultModal 
            onClose={onCloseModal} 
            onCreate={onCreateVault}
            originUser={username} 
          />
        }
      </div>
    </div>
  );
}

export default VaultsContent;
