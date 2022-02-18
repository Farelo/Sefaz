import { Container } from './Aside.style';
import { Nav } from '../Nav/Nav';
import LogoEvoy from '../../../assets/imagens/logo-evoy-color.png';

type asideProps = {
  openMenu: () => void;
  isActive: boolean;
};
export function Aside({ openMenu, isActive }: asideProps): JSX.Element {
  return (
    <>
      <Container isActive={isActive}>
        <button type="button" onClick={openMenu}>
          <img src={LogoEvoy} alt="Logo Evoy" />
        </button>
        <Nav />
      </Container>
    </>
  );
}
