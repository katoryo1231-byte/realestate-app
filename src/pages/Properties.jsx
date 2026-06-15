import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

// 物件フォームの初期値
const emptyForm = { name: '', rent: '', area: '', layout: '' }

function Properties() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  // 物件一覧を取得（自分が登録した物件のみRLSにより返ってくる）
  const fetchProperties = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage('物件の取得に失敗しました：' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // フォーム入力値の変更
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 編集開始：フォームに既存の値をセットする
  const handleEdit = (property) => {
    setEditingId(property.id)
    setForm({
      name: property.name,
      rent: property.rent,
      area: property.area,
      layout: property.layout,
    })
  }

  // 編集キャンセル
  const handleCancel = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  // 新規登録・更新の送信処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const propertyData = {
      name: form.name,
      rent: Number(form.rent),
      area: form.area,
      layout: form.layout,
    }

    if (editingId) {
      // 既存物件の更新
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', editingId)

      if (error) {
        setErrorMessage('更新に失敗しました：' + error.message)
        return
      }
    } else {
      // 新規物件の登録（user_idはログインユーザーのIDを設定）
      const { error } = await supabase
        .from('properties')
        .insert({ ...propertyData, user_id: session.user.id })

      if (error) {
        setErrorMessage('登録に失敗しました：' + error.message)
        return
      }
    }

    setForm(emptyForm)
    setEditingId(null)
    fetchProperties()
  }

  // 物件の削除
  const handleDelete = async (id) => {
    setErrorMessage('')
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      setErrorMessage('削除に失敗しました：' + error.message)
      return
    }

    fetchProperties()
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </header>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* 物件の新規登録・編集フォーム */}
      <form className="property-form" onSubmit={handleSubmit}>
        <h2>{editingId ? '物件を編集' : '物件を新規登録'}</h2>
        <div className="form-group">
          <label htmlFor="name">物件名</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rent">家賃（円）</label>
          <input
            id="rent"
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">エリア名</label>
          <input
            id="area"
            name="area"
            type="text"
            value={form.area}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="layout">間取り</label>
          <input
            id="layout"
            name="layout"
            type="text"
            placeholder="例：1LDK"
            value={form.layout}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">{editingId ? '更新する' : '登録する'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={handleCancel}>
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* 物件一覧 */}
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="property-list">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p>家賃：{property.rent.toLocaleString()}円</p>
              <p>エリア：{property.area}</p>
              <p>間取り：{property.layout}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(property)}>編集</button>
                <button className="danger" onClick={() => handleDelete(property.id)}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Properties
