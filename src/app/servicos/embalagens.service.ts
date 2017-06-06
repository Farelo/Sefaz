import { Injectable } from '@angular/core';

@Injectable()
export class EmbalagensService {

  private embalagens: any[] = [
    {id: 1, nome: 'Embalagem1', descricao: 'Lorem ipsum dolor sit amet', duns: '56', fornecedor: '086', ultimaAtualizacao: '12/12/12', status: 'atrasado'},
    {id: 2, nome: 'Embalagem2', descricao: 'Lorem ipsum dolor sit amet', duns: '56', fornecedor: '086', ultimaAtualizacao: '12/12/12',  status: 'ok'},
    {id: 3, nome: 'Embalagem3', descricao: 'Lorem ipsum dolor sit amet', duns: '56', fornecedor: '086', ultimaAtualizacao: '12/12/12',  status: 'quase'},
    {id: 4, nome: 'Embalagem4', descricao: 'Lorem ipsum dolor sit amet', duns: '56', fornecedor: '086', ultimaAtualizacao: '12/12/12', status: 'atrasado'},
    {id: 5, nome: 'Embalagem5', descricao: 'Lorem ipsum dolor sit amet', duns: '56', fornecedor: '086', ultimaAtualizacao: '12/12/12',  status: 'ok'},
  ];

  getEmbalagens(){
    return this.embalagens;
  }

  getEmbalagem(id: number){
    for (let i=0; i<this.embalagens.length; i++){
      let embalagem = this.embalagens[i];
      if (embalagem.id == id){
        return embalagem;
      }
    }
    return null;
  }
  constructor() { }

}
