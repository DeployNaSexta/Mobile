import { useNavigate } from "react-router-dom";
import Icon from "../icons/Icon";
import { useApp } from "../../context/AppContext";
import { formatUpdated } from "../../utils/format";

const STATUS_LABEL = { operando: "Operando", alerta: "Alerta", critico: "Crítico" };

export default function MachineCard({ machine, selected }) {
  const navigate = useNavigate();
  const { setSelectedMachineId } = useApp();

  function open() {
    setSelectedMachineId(machine.id);
    navigate("/dashboard");
  }

  return (
    <div className={`machine-card ${selected ? "selected" : ""}`} onClick={open}>
      <div className="head">
        <div className="machine-icon"><Icon name="machine" size={22} /></div>
        <div className="txt">
          <div className="name">{machine.name}</div>
          <div className="model">{machine.model}</div>
        </div>
        <span className={`badge ${machine.status}`}>{STATUS_LABEL[machine.status]}</span>
      </div>
      <div className="specs">
        <span className="spec"><Icon name="thermometer" size={13} />{machine.temp}°C</span>
        <span className="spec"><Icon name="pulse" size={13} />{machine.vib} mm/s</span>
        <span className="spec"><Icon name="clock" size={13} />{formatUpdated(machine.updatedAt)}</span>
      </div>
    </div>
  );
}
