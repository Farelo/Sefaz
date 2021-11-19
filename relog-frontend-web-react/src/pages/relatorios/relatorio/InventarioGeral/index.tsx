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
              <span /> Atraso de rota
            </p>
            <p>
              <span /> Local incorreto
            </p>
          </div>
          <div>
            <p>
              <span /> Tempo de permanência
            </p>
            <p>
              <span /> Embalagem ausente
            </p>
          </div>
          <div>
            <p>
              <span /> Sem sinal
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
      </section>
    </Container>
  );
}

export { InventarioGeral as default };
