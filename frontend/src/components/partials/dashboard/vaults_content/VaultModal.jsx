/* eslint-disable no-unused-vars */
import { Modal } from "react-bootstrap";
import { VaultIcon, EllipsisIcon } from "../../../../assets/dashboard";
import styles from "../../../../styles/VaultModal.module.css"; 
import CustomCheckbox from "../../../shared/CustomCheckbox"; 

const VaultModal = ({ data, show, onHide }) => {
  const vaultName = data ? data.vaultName : "Nome do Vault";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <div className="d-flex align-items-center gap-2">
          <span><VaultIcon/></span>
          <Modal.Title className="mb-0">AA</Modal.Title>
        </div>
        <div className="ms-auto text-muted" style={{ cursor: "pointer" }}>
          <EllipsisIcon/>
        </div>
      </Modal.Header>

      <Modal.Body className={styles.scrollPanel}>
        {/* Cabeçalho do painel */}
        <div className={`${styles.panelHeader} d-flex align-items-center px-3 py-2`}>
          <div className="me-3">
            <CustomCheckbox />
          </div>
          <div className="flex-grow-1 fw-bold">Todos</div>
          <div className="flex-grow-1 fw-bold">Nome</div>
          <div className="flex-grow-1 fw-bold">Proprietário</div>
        </div>
        <hr className="m-0" />

        {/* Conteúdo scrollável */}
        <div className={styles.panelContent}>
          {/* Aqui você renderiza os itens */}
          <div className="d-flex align-items-center px-3 py-2">
            <CustomCheckbox />
            <div className="flex-grow-1">Item 1</div>
            <div className="flex-grow-1">Nome 1</div>
            <div className="flex-grow-1">Prop 1</div>
          </div>
          {/* Repetir conforme necessário */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VaultModal;
