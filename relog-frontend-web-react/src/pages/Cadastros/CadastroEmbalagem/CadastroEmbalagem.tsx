import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Container } from './CadastroEmbalagem.style';

export function CadastroEmbalagem(): JSX.Element {
  return (
    <Container>
      <div className="search-session">
        <input
          type="text"
          placeholder="Busque uma embalagem por familia, serial ou tag"
        />
        <button type="button">
          <FiPlus size={20} color="#fff" />
          Novo
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Familia</th>
            <th>Serial</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
            <td>LJR6</td>
            <td>0325 J</td>
            <td>426035</td>
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
