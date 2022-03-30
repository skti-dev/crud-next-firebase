import React, { useState, useEffect } from 'react'
// import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { database } from '../services/firebase'

export default function Home() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const handleSubmit = (e) => {
    try {
      e.preventDefault()

      if(!nome || !email || !telefone) return alert("Preencha os campos nome, email e telefone.")

      database.ref('contatos').push({
        nome,
        email,
        telefone,
        observacoes
      })
      setNome('')
      setEmail('')
      setTelefone('')
      setObservacoes('')
    }catch(e) {
      console.error("Erro ao enviar formulário: ", e)
    }
  }

  const [contatos, setContatos] = useState([])

  useEffect(() => {
    database.ref('contatos').on('value', snapshot => {
      const data = Object.entries(snapshot.val() ?? {}).map(([key, value]) => {
        return {
          key,
          ...value
        }
      })
      setContatos(data)
    })
  }, [])

  const handleDelete = (key) => {
    database.ref(`contatos/${key}`).remove()
  }

  const [estaBuscando, setEstaBuscando] = useState(false)
  const [resultadosBusca, setResultadosBusca] = useState([])

  const handleSearch = (value) => {
    if(!value) {
      setEstaBuscando(false)
      setResultadosBusca([])
      return
    }
      
    const dados = []
    contatos.forEach(contato => {
      const regex = new RegExp(value, 'gi')
      if(regex.test(contato.nome)) dados.push(contato)
    })
    setResultadosBusca(dados)
    setEstaBuscando(true)
  }

  const [chaveEdicao, setChaveEdicao] = useState('')

  const handleEdit = (contato) => {
    setChaveEdicao(contato.key)
    setNome(contato.nome)
    setEmail(contato.email)
    setTelefone(contato.telefone)
    setObservacoes(contato.observacoes)
  }

  const updateContato = (key) => {
    if(!nome || !email || !telefone) return alert("Preencha os campos nome, email e telefone.")
    database.ref(`contatos/${key}`).update({
      nome,
      email,
      telefone,
      observacoes
    })
    setNome('')
    setEmail('')
    setTelefone('')
    setObservacoes('')
    setChaveEdicao('')
  }


  return (
    <>
      <main className={styles.container}>
        <form onSubmit={e => chaveEdicao ? updateContato(chaveEdicao) : handleSubmit(e)}>
          {
            chaveEdicao && (
              <strong className={styles.edicao}> Editando cliente </strong>
            )
          }
          <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}/>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
          <input type="tel" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)}/>
          <textarea placeholder="Observações"value={observacoes} onChange={e => setObservacoes(e.target.value)}></textarea>
          <button type="submit"> {chaveEdicao ? `Editar` : `Salvar`} </button>
        </form>
        <div className={styles.contacts}>
          <input type="text" onChange={e => handleSearch(e.target.value)} placeholder="Buscar por nome" />
          {
            !estaBuscando && contatos.length > 0 && contatos.map(contato => (
              <div className={styles.card} key={contato.key}>
                <div className={styles.boxCard}>
                  <p className={styles.title}>{contato.nome}</p>
                  <div>
                    <a onClick={() => handleEdit(contato)}>Editar</a>
                    <a onClick={() => handleDelete(contato.key)}>Excluir</a>
                  </div>
                </div>
                <div className={styles.boxInfos}>
                  <p className={styles.infos}>{contato.email}</p>
                  <p className={styles.infos}>{contato.telefone}</p>
                  <p className={styles.infos}>{contato.observacoes}</p>
                </div>
              </div>
            ))
          }
          {
            estaBuscando && resultadosBusca.length > 0 && resultadosBusca.map(contatoBusca => (
              <div className={styles.card} key={contatoBusca.key}>
                <div className={styles.boxCard}>
                  <p className={styles.title}>{contatoBusca.nome}</p>
                  <div>
                    <a>Editar</a>
                    <a onClick={() => handleDelete(contatoBusca.key)}>Excluir</a>
                  </div>
                </div>
                <div className={styles.boxInfos}>
                  <p className={styles.infos}>{contatoBusca.email}</p>
                  <p className={styles.infos}>{contatoBusca.telefone}</p>
                  <p className={styles.infos}>{contatoBusca.observacoes}</p>
                </div>
              </div>
            ))
          }
          {
            estaBuscando && resultadosBusca.length == 0 && (
              <p>Nenhum contato encontrado</p>
            )
          }
        </div>
      </main>
    </>
  )
}
