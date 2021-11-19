import { Container } from './RelatorioGeralSelect.style';

export function RelatorioGeralSelect() {
  return (
    <Container>
      <div className="select-group">
        <p>Empresa vinculada</p>
        <select defaultValue="">
          <option value="" disabled>
            Selecione a empresa vinculada ao equipamento
          </option>
          <option value="">Equipamento</option>
        </select>
      </div>
      <div className="select-group">
        <p>Familia</p>
        <select defaultValue="">
          <option value="" disabled>
            Selecione a familia do equipamento
          </option>
          <option value="default">Default</option>
          <option value="InventarioGeral">Inventario Geral</option>
          <option value="InventarioPosicoes">Inventario Posicoes</option>
        </select>
      </div>
    </Container>
  );
}
