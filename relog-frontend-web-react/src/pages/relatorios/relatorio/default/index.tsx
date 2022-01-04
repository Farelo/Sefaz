import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Container } from './noReport.style';

export function NoReport(): JSX.Element {
  return (
    <Container>
      <AiOutlineCloseCircle size={64} />
      <h1>Selecione a categoria e modelo do relatorio</h1>
    </Container>
  );
}
export { NoReport as default };
