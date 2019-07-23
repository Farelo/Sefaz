package br.com.projeto.repository.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
 
 
@Entity
@Table(name="tb_pessoa")

@NamedQueries({
	
	@NamedQuery(name = "PessoaEntity.findAll",query= "SELECT p FROM PessoaEntity p")
})

public class PessoaEntity {
 
	@Id
	@GeneratedValue
	@Column(name = "id_pessoa")
	private Integer codigo;
 
	@Column(name = "nm_pessoa")
	private String  nome;
	
	@Column(name = "ds_email")
	private String  email;
 
	@Column(name = "fl_origemCadastro")
	private String  origemCadastro;
 
	@OneToOne
	@JoinColumn(name="id_usuario_cadastro")
	private UsuarioEntity usuarioEntity;
	
	
 
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
	public UsuarioEntity getUsuarioEntity() {
		return usuarioEntity;
	}
	public void setUsuarioEntity(UsuarioEntity usuarioEntity) {
		this.usuarioEntity = usuarioEntity;
	}
 
}