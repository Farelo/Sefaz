package br.com.projeto.pessoa.controller;

import java.io.Serializable;
import java.util.List;
 
import javax.annotation.PostConstruct;
import javax.enterprise.inject.Produces;
import javax.faces.view.ViewScoped;
import javax.inject.Inject;
import javax.inject.Named;
 
import br.com.projeto.model.PessoaModel;
import br.com.projeto.repository.PessoaRepository;
 
@Named(value="consultarPessoaController")
@ViewScoped
public class ConsultarPessoaController implements Serializable {
 
	private static final long serialVersionUID = 1L;
 
	@Inject transient
	private PessoaModel pessoaModel;
 
	@Produces 
	private List<PessoaModel> pessoas;
 
	@Inject transient
	private PessoaRepository pessoaRepository;
 
	public List<PessoaModel> getPessoas() {
		return pessoas;
	}
	public void setPessoas(List<PessoaModel> pessoas) {
		this.pessoas = pessoas;
	}		
	public PessoaModel getPessoaModel() {
		return pessoaModel;
	}
	public void setPessoaModel(PessoaModel pessoaModel) {
		this.pessoaModel = pessoaModel;
	}
 
	/***
	 * CARREGA AS PESSOAS NA INICIALIZAÇÃO 
	 */
	@PostConstruct
	public void init(){
 
		//RETORNAR AS PESSOAS CADASTRADAS
		this.pessoas = pessoaRepository.GetPessoas();
	}
	/***
	 * CARREGA INFORMAÇÕES DE UMA PESSOA PARA SER EDITADA
	 * @param pessoaModel
	 */
	public void Editar(PessoaModel pessoaModel){
 
		/*PEGA APENAS O NOME DA PESSOA*/
		pessoaModel.setNome(pessoaModel.getNome());
 
		this.pessoaModel = pessoaModel;
 
	}
 
	/***
	 * ATUALIZA O REGISTRO QUE FOI ALTERADO
	 */
	public void AlterarRegistro(){
 
		this.pessoaRepository.AlterarRegistro(this.pessoaModel);	
 
 
		/*RECARREGA OS REGISTROS*/
		this.init();
	}
 
}