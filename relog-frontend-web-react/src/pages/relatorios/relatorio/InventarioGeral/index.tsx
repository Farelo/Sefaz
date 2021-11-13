import { Container } from './InventarioGeral.style';

function InventarioGeral(): JSX.Element {
  return (
    <Container>
      <h1>Relatorio Geral</h1>
      <p>
        Component <strong>relatorio geral</strong> renderizado com sucesso
      </p>
    </Container>
  );
}

export { InventarioGeral as default };
