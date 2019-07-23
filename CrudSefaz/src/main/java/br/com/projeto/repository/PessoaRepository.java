package br.com.projeto.repository;
 

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
 
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
 
import br.com.projeto.model.PessoaModel;
import br.com.projeto.model.UsuarioModel;
import br.com.projeto.repository.entity.PessoaEntity;
import br.com.projeto.repository.entity.UsuarioEntity;
import br.com.projeto.uteis.Uteis;
 
public class PessoaRepository {
 
	@Inject
	PessoaEntity pessoaEntity;
 
	EntityManager entityManager;
 
	/***
	 * MÉTODO RESPONSÁVEL POR SALVAR UMA NOVA PESSOA
	 * @param pessoaModel
	 */
	public void SalvarNovoRegistro(PessoaModel pessoaModel){
 
		entityManager =  Uteis.JpaEntityManager();
 
		pessoaEntity = new PessoaEntity();
		pessoaEntity.setEmail(pessoaModel.getEmail());
		pessoaEntity.setNome(pessoaModel.getNome());
		pessoaEntity.setOrigemCadastro(pessoaModel.getOrigemCadastro());
		
 
		UsuarioEntity usuarioEntity = entityManager.find(UsuarioEntity.class, pessoaModel.getUsuarioModel().getCodigo()); 
 
		pessoaEntity.setUsuarioEntity(usuarioEntity);
 
		entityManager.persist(pessoaEntity);
 
	}
 
	/***
	 * MÉTODO PARA CONSULTAR A PESSOA
	 * @return
	 */
	public List<PessoaModel> GetPessoas(){
 
		List<PessoaModel> pessoasModel = new ArrayList<PessoaModel>();
 
		entityManager =  Uteis.JpaEntityManager();
 
		Query query = entityManager.createNamedQuery("PessoaEntity.findAll");
 
		@SuppressWarnings("unchecked")
		Collection<PessoaEntity> pessoasEntity = (Collection<PessoaEntity>)query.getResultList();
 
		PessoaModel pessoaModel = null;
 
		for (PessoaEntity pessoaEntity : pessoasEntity) {
 
			pessoaModel = new PessoaModel();
			pessoaModel.setCodigo(pessoaEntity.getCodigo());
			pessoaModel.setEmail(pessoaEntity.getEmail());
			pessoaModel.setNome(pessoaEntity.getNome());
 
			
 
			UsuarioEntity usuarioEntity =  pessoaEntity.getUsuarioEntity();			
 
			UsuarioModel usuarioModel = new UsuarioModel();
			usuarioModel.setUsuario(usuarioEntity.getUsuario());
 
			pessoaModel.setUsuarioModel(usuarioModel);
 
			pessoasModel.add(pessoaModel);
		}
 
		return pessoasModel;
 
	}
	/***
	 * CONSULTA UMA PESSOA CADASTRADA PELO CÓDIGO
	 * @param codigo
	 * @return
	 */
	private PessoaEntity GetPessoa(int codigo){
 
		entityManager =  Uteis.JpaEntityManager();
 
		return entityManager.find(PessoaEntity.class, codigo);
	}
 
	/***
	 * ALTERA UM REGISTRO CADASTRADO NO BANCO DE DADOS
	 * @param pessoaModel
	 */
	public void AlterarRegistro(PessoaModel pessoaModel){
 
		entityManager =  Uteis.JpaEntityManager();
 
		PessoaEntity pessoaEntity = this.GetPessoa(pessoaModel.getCodigo());
 
		pessoaEntity.setEmail(pessoaModel.getEmail());
		pessoaEntity.setNome(pessoaModel.getNome());
		
 
		entityManager.merge(pessoaEntity);
	}
	/***
	 * EXCLUI UM REGISTRO DO BANCO DE DADOS
	 * @param codigo
	 */
	public void ExcluirRegistro(int codigo){
 
		entityManager =  Uteis.JpaEntityManager();		
 
		PessoaEntity pessoaEntity = this.GetPessoa(codigo);
 
		entityManager.remove(pessoaEntity);
	}
}