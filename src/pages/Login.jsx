import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { mockApi } from '../api/mockApi'
import { auth } from '../utils/auth'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const { token, user } = await mockApi.login({ email, password })
      auth.save(token, user)
      nav('/')
    }catch(err){ setErr(err.message || 'Error') }
  }

  return (
    <div className="container">
      <div className="header"><h2>Iniciar sesión</h2></div>
      <form onSubmit={submit} style={{display:'grid',gap:12}}>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button className="button" type="submit">Entrar</button>
        <div style={{marginTop:8}}><Link to="/register">Crear cuenta</Link></div>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
    </div>
  )
}
