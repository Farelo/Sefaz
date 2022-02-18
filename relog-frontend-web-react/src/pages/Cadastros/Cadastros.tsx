import { NavLink, Outlet } from 'react-router-dom';

import { Container } from './Cadastro.style';

export function Cadastros(): JSX.Element {
  return (
    <>
      <Container>
        <ul>
          <li>
            <NavLink to="embalagem/">Embalagens</NavLink>
          </li>
          <li>
            <NavLink to="familia/">Familias</NavLink>
          </li>
          <li>
            <NavLink to="/">Ponto de Controle</NavLink>
          </li>
          <li id="tipo">
            <NavLink to="/">Tipos de Pontos de Controle</NavLink>
          </li>
          <li>
            <NavLink to="/">Empresas</NavLink>
          </li>
          <li>
            <NavLink to="/">Rotas</NavLink>
          </li>
          <li>
            <NavLink to="/">Departamento</NavLink>
          </li>
          <li>
            <NavLink to="/">Projetos</NavLink>
          </li>
        </ul>
        <div id="component">
          <Outlet />
        </div>
      </Container>
    </>
  );
}
