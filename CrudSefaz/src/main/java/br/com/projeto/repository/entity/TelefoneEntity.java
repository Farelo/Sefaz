package br.com.projeto.repository.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="tb_telefone")

@NamedQueries({
	
	@NamedQuery(name = "TelefoneEntity.findAll",query= "SELECT p FROM TelefoneEntity p")
})
public class TelefoneEntity {
	
	@Id
	@GeneratedValue
	@Column(name = "id_telefone")
	private String id;
	
	@Column(name = "ds_ddd")
	private String ddd;
	
	@Column(name = "ds_numero")
	private String numero;
	
	@Column(name = "nm_tipo")
	private String tipo;
	
	
	@JoinColumn(name="id_usuario_telefone")
	private UsuarioEntity usuarioEntity;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getDdd() {
		return ddd;
	}
	public void setDdd(String ddd) {
		this.ddd = ddd;
	}
	public String getNumero() {
		return numero;
	}
	public void setNumero(String numero) {
		this.numero = numero;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public UsuarioEntity getUsuarioEntity() {
		return usuarioEntity;
	}
	public void setUsuarioEntity(UsuarioEntity usuarioEntity) {
		this.usuarioEntity = usuarioEntity;
	}

}
