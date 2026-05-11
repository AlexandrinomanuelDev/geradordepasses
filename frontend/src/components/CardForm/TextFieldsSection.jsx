import useCardStore from '../../store/cardStore';

export default function TextFieldsSection() {
  const { name, jobTitle, employeeId, admissionDate, companyName, accentColor, goldColor, setField } = useCardStore();

  return (
    <div className="form-section">
      <h3>Dados do Colaborador</h3>
      <label>
        Nome completo
        <input value={name} onChange={(e) => setField('name', e.target.value)} placeholder="João Silva" />
      </label>
      <label>
        Cargo
        <input value={jobTitle} onChange={(e) => setField('jobTitle', e.target.value)} placeholder="Engenheiro de Software" />
      </label>
      <label>
        Nº Funcional
        <input value={employeeId} onChange={(e) => setField('employeeId', e.target.value)} placeholder="001234" />
      </label>
      <label>
        Data de Admissão
        <input value={admissionDate} onChange={(e) => setField('admissionDate', e.target.value)} placeholder="01/01/2024" />
      </label>
      <label>
        Nome da Empresa
        <input value={companyName} onChange={(e) => setField('companyName', e.target.value)} placeholder="Empresa S.A." />
      </label>
      <div className="color-row">
        <label>
          Cor Principal
          <input type="color" value={accentColor} onChange={(e) => setField('accentColor', e.target.value)} />
        </label>
        <label>
          Cor Dourada
          <input type="color" value={goldColor} onChange={(e) => setField('goldColor', e.target.value)} />
        </label>
      </div>
    </div>
  );
}
