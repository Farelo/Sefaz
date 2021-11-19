import { Container } from './Home.style';
import { ButtonComponent } from '../../components/form/index';

export function Home(): JSX.Element {
  return (
    <Container>
      <h1>Tela de Dashboard</h1>
      <p>Aqui vai a tela de home de Dashboard da aplicação</p>
      <p>Graficos e etc</p>
      <ButtonComponent />
    </Container>
  );
}
