package br.com.projeto.model;

public class PessoaModel {
	 
	private Integer codigo;
	private String  nome;
	private String  email;
	private String  origemCadastro;  
	private UsuarioModel    usuarioModel;
 
	public Integer getCodigo() {
		return codigo;
	}
	public void setCodigo(Integer codigo) {
		this.codigo = codigo;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;

	}

	public String getOrigemCadastro() {
		return origemCadastro;
	}
	public void setOrigemCadastro(String origemCadastro) {
		this.origemCadastro = origemCadastro;
	}
	public UsuarioModel getUsuarioModel() {
		return usuarioModel;
	}
	public void setUsuarioModel(UsuarioModel usuarioModel) {
		this.usuarioModel = usuarioModel;
	}
 
}