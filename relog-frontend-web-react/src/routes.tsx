import {
  Routes,
  Route,
  useRoutes,
  useLocation,
  useMatch,
} from 'react-router-dom';
import { Home } from './pages/Dashboard/Home';
import { Relatorio } from './pages/relatorios/Relatorio';
import { Cadastros } from './pages/Cadastros/Cadastros';
import { Header } from './components/layout/Header/Header';
import { CadastroEmbalagem } from './pages/Cadastros/CadastroEmbalagem/CadastroEmbalagem';
import { CadastroFamilia } from './pages/Cadastros/CadastroFamilia/CadastroFamilia';

export default function MainRoutes() {
  const { pathname } = useLocation();
  const subtitle = pathname.split('/');
  const routes = [
    {
      path: '/dashboard',
      element: (
        <>
          <Header title="Dashboard" />
          <Home />
        </>
      ),
    },
    {
      path: '/relatorio',
      element: (
        <>
          <Header title="Relatorios" />
          <Relatorio />
        </>
      ),
    },
    {
      path: '/cadastros',
      element: (
        <>
          <Header title="Cadastro" subtitle={subtitle[2]} />
          <Cadastros />
        </>
      ),
      children: [
        { path: '/cadastros/embalagem', element: <CadastroEmbalagem /> },
        { path: '/cadastros/familia', element: <CadastroFamilia /> },
      ],
    },
  ];
  const element = useRoutes(routes);
  return <>{element}</>;
}
