import { Container } from './Header.style';

type props = {
  title: string;
};

export function Header({ title }: props): JSX.Element {
  return (
    <Container>
      <h1>{title}</h1>
    </Container>
  );
}
