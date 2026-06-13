import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()

  // 会員登録処理
  const handleSignup = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMessage('会員登録に失敗しました：' + error.message)
      return
    }

    // メール確認が不要な設定の場合はすでにログイン済みになる
    if (data.session) {
      navigate('/properties')
      return
    }

    setSuccessMessage('登録確認メールを送信しました。メール内のリンクから確認を完了してください。')
  }

  return (
    <div className="auth-container">
      <h1>会員登録</h1>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">登録する</button>
      </form>
      <p>
        ログインは<Link to="/login">こちら</Link>
      </p>
    </div>
  )
}

export default Signup
