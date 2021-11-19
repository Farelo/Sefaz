import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Container } from './CadastroFamilia.style';

export function CadastroFamilia(): JSX.Element {
  return (
    <Container>
      <div className="search-session">
        <input type="text" placeholder="Buscar Familia por nome" />
        <button type="button">
          <FiPlus size={20} color="#fff" />
          Novo
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LJ</td>
            <td className="crud">
              <button type="button">
                <FiEdit size={20} color="#01358D" />
              </button>
              <button type="button">
                <FiTrash2 size={20} color="#E24747" />
              </button>
            </td>
          </tr>
          <tr>
            <td>LTR6</td>
            <td className="crud">
              <button type="button">
                <FiEdit size={20} color="#01358D" />
              </button>
              <button type="button">
                <FiTrash2 size={20} color="#E24747" />
              </button>
            </td>
          </tr>
          <tr>
            <td>LTR5</td>
            <td className="crud">
              <button type="button">
                <FiEdit size={20} color="#01358D" />
              </button>
              <button type="button">
                <FiTrash2 size={20} color="#E24747" />
              </button>
            </td>
          </tr>
          <tr>
            <td>CDTR14</td>
            <td className="crud">
              <button type="button">
                <FiEdit size={20} color="#01358D" />
              </button>
              <button type="button">
                <FiTrash2 size={20} color="#E24747" />
              </button>
            </td>
          </tr>
          <tr>
            <td>OCOR-S</td>
            <td className="crud">
              <button type="button">
                <FiEdit size={20} color="#01358D" />
              </button>
              <button type="button">
                <FiTrash2 size={20} color="#E24747" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}
