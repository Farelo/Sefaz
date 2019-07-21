package br.com.projeto.pessoa.controller;

import java.io.IOException;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;


import org.primefaces.model.UploadedFile;


import br.com.projeto.model.PessoaModel;
import br.com.projeto.repository.PessoaRepository;
import br.com.projeto.usuario.controller.UsuarioController;
import br.com.projeto.uteis.Uteis;

@Named(value="cadastrarPessoaController")
@RequestScoped
public class CadastrarPessoaController {

	@Inject
	PessoaModel pessoaModel;
	
	@Inject
	UsuarioController usuarioController;
	
	@Inject
	PessoaRepository pessoaRepository;

	
	private UploadedFile file;
	
	public UploadedFile getFile() {
		return file;
	}

	public void setFile(UploadedFile file) {
		this.file = file;
	}
		
	public PessoaModel getPessoaModel() {
		return pessoaModel;
	}

	public void setPessoaModel(PessoaModel pessoaModel) {
		this.pessoaModel = pessoaModel;
	}
	
	/**
	 *SALVA UM NOVO REGISTRO VIA INPUT 
	 */
	public void SalvarNovaPessoa(){
		
		pessoaModel.setUsuarioModel(this.usuarioController.GetUsuarioSession());
		
		//INFORMANDO QUE O CADASTRO FOI VIA INPUT
		pessoaModel.setOrigemCadastro("I");
		
		pessoaRepository.SalvarNovoRegistro(this.pessoaModel);
		
		this.pessoaModel = null;
		
		Uteis.MensagemInfo("Registro cadastrado com sucesso");
		
	}
	
	
	 }


