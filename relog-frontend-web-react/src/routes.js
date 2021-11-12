import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Dashboard/Home'
import { Relatorio } from './pages/relatorios/Relatorio'

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/relatorio" element={<Relatorio />} />
    </Routes>
  )
}
