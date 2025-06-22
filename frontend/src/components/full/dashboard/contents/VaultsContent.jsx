import { useState } from 'react'
import { FloatingBox, VaultPanel, NewVaultModal } from "../../../index";

function VaultsContent({username}) {
  const [modalVisible, setModalVisible] = useState(false)

  const closeModal = () => {
    setModalVisible(false)
    console.log('modal fechado')
  }

  const createVault = () => {
    closeModal()
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
            onClose={() => closeModal()} 
            onCreate={() => createVault()}
            originUser={username} 
          />
        }
      </div>
    </div>
  );
}

export default VaultsContent;
