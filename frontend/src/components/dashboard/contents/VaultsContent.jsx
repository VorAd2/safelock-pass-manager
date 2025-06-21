import { FloatingBox, VaultPanel } from "../../index";

function VaultsContent() {
  return (
    <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
      <div className="p-3" style={{ width: '25%', minWidth: '250px' }}>
        <FloatingBox />
      </div>

      <div className="p-3 flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        <VaultPanel />
      </div>
    </div>
  );
}

export default VaultsContent;
