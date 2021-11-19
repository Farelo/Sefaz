import { ChangeEvent } from 'react';
import { Container } from './SearchComponent.style';

type SearchComponentProps = {
  handleSelectModel: (event: ChangeEvent<HTMLSelectElement>) => void;
};
export function SearchComponent({
  handleSelectModel,
}: SearchComponentProps): JSX.Element {
  return (
    <Container>
      <h1>Buscar relatório por:</h1>
      <div className="select-container">
        <div className="select-group">
          <p>Categoria</p>
          <select defaultValue="">
            <option value="" disabled>
              Selecione uma categoria
            </option>
            <option value="">Equipamento</option>
          </select>
        </div>
        <div className="select-group">
          <p>Modelo</p>
          <select onChange={handleSelectModel} defaultValue="">
            <option value="" disabled>
              Selecione uma categoria
            </option>
            <option value="default">Default</option>
            <option value="InventarioGeral">Inventario Geral</option>
            <option value="InventarioPosicoes">Inventario Posicoes</option>
          </select>
        </div>
      </div>
    </Container>
  );
}
