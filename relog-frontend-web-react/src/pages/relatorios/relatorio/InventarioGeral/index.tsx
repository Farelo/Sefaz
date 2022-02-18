import { GrDocumentPdf, GrDocumentCsv } from 'react-icons/gr';
import { Container } from './InventarioGeral.style';
import { RelatorioGeralSelect } from '../../../../components/layout/index';

function InventarioGeral(): JSX.Element {
  return (
    <Container>
      <div className="head-container">
        <h1>
          Inventario Geral <span> &gt; Todas as Empresas</span>
        </h1>

        <div>
          <button type="button">
            <GrDocumentPdf size={16} color="#01358D" />
            PDF
          </button>
          <button type="button">
            <GrDocumentCsv />
            CSV
          </button>
        </div>
      </div>
      <RelatorioGeralSelect />
      <div id="legenda">
        <p>PC = ponto de controle</p>
        <div className="legenda-alertas">
          <p>Tipos de Alertas</p>
          <div>
            <p>
              <span className="blue" /> Atraso de rota
            </p>
            <p>
              <span className="orange" /> Local incorreto
            </p>
          </div>
          <div>
            <p>
              <span className="orange" /> Tempo de permanência
            </p>
            <p>
              <span className="blue" /> Embalagem ausente
            </p>
          </div>
          <div>
            <p>
              <span className="green" /> Sem sinal
            </p>
            <p>
              <span /> Embalagem incorreto
            </p>
          </div>
        </div>
      </div>
      <section>
        <div id="inventario-fisico">
          <h1>Inventário Físico</h1>
          <table>
            <thead>
              <tr>
                <th>Familia</th>
                <th>Total físico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
              <tr>
                <td>SST4</td>
                <td>477</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="inventario-online">
          <h1>Inventário Online</h1>
          <table>
            <thead>
              <tr>
                <th>Em PCs Própios</th>
                <th>Em PCs administrados</th>
                <th>Em trânsito</th>
                <th>Em análise</th>
                <th>Total online</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
                <td>477</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="diferenca-container">
          <table>
            <thead>
              <tr>
                <th>Diferença entre fisico e online</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
              <tr>
                <td>477</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="alertas">
          <table>
            <thead>
              <tr>
                <th>
                  <h1>Alertas</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="blue">!</span>
                </td>
                <td>
                  <span className="orange">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="red">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="blue">!</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span className="orange">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="red">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="blue">!</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="blue">!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span className="blue">!</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span className="blue">!</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="blue">!</span>
                </td>
                <td>
                  <span className="orange">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="red">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="blue">!</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="blue">!</span>
                </td>
                <td>
                  <span className="orange">!</span>
                </td>
                <td>
                  <span className="green">!</span>
                </td>
                <td>
                  <span className="red">!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
                <td>
                  <span>!</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </Container>
  );
}

export { InventarioGeral as default };
