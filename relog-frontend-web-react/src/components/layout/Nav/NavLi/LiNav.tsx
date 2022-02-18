import { NavLink, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons';

import { Container } from './LiNav.style';

type linavProps = {
  title: string;
  to: string;
  icon: IconType;
};

export function LiNav({ title, to, icon: Icon }: linavProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Container className={pathname === to ? 'active' : ''}>
      <NavLink to={to}>
        <Icon size={32} color="#01358D" />
        <p>{title}</p>
      </NavLink>
    </Container>
  );
}
