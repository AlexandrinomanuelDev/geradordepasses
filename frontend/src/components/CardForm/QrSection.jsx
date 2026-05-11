import useCardStore from '../../store/cardStore';

export default function QrSection() {
  const { qrData, setField } = useCardStore();

  return (
    <div className="form-section">
      <h3>QR Code</h3>
      <label>
        Dados / URL para o QR Code
        <input
          value={qrData}
          onChange={(e) => setField('qrData', e.target.value)}
          placeholder="https://empresa.pt/colaborador/001234"
        />
      </label>
    </div>
  );
}
