type buttonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  type?: 'button' | 'submit' | 'reset';
  width: number;
  height: number;
};

export function ButtonComponent(): JSX.Element {
  return <button type="button">Novo</button>;
}
