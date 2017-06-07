import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CadastrosComponent } from './cadastros.component';
import { TagsComponent } from './tags/tags.component';
import { EmbalagemComponent } from './embalagem/embalagem.component';
import { ScannerComponent } from './scanner/scanner.component';
import { SetorComponent } from './setor/setor.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { PlataformaComponent } from './plataforma/plataforma.component';
import { RotasComponent } from './rotas/rotas.component';
import { PlantaComponent } from './planta/planta.component';
import { EmbalagemDetalheComponent } from './embalagem/embalagem-detalhe/embalagem-detalhe.component';

const CadastrosRoutes = [
  {path: 'cadastros', component: CadastrosComponent, children: [
    {path: 'tags', component: TagsComponent},
    {path: 'scanner', component: ScannerComponent},
    {path: 'embalagem', component: EmbalagemComponent},
    {path: 'embalagem/:id', component: EmbalagemDetalheComponent},
    {path: 'setor', component: SetorComponent},
    {path: 'fornecedor', component: FornecedorComponent},
    {path: 'plataforma', component: PlataformaComponent},
    {path: 'rotas', component: RotasComponent},
    {path: 'planta', component: PlantaComponent}

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(CadastrosRoutes)],
  exports: [RouterModule]
})

export class CadastrosRoutingModule {}
