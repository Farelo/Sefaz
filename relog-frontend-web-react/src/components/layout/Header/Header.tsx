import { Container } from './Header.style';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps): JSX.Element {
  return (
    <Container>
      <h1>{title}</h1>
      <span>{subtitle ? <span> &gt; {subtitle}</span> : ''}</span>
    </Container>
  );
}
