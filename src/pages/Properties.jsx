import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// ダミーの物件データ
const dummyProperties = [
  { id: 1, name: 'サンライズマンション101', rent: '85,000円', area: '東京都渋谷区' },
  { id: 2, name: 'グリーンハイツ203', rent: '72,000円', area: '東京都世田谷区' },
  { id: 3, name: 'パークレジデンス305', rent: '120,000円', area: '東京都港区' },
  { id: 4, name: 'コーポ桜台402', rent: '65,000円', area: '神奈川県横浜市' },
  { id: 5, name: 'メゾン花畑1F', rent: '58,000円', area: '埼玉県川口市' },
]

function Properties() {
  const navigate = useNavigate()

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </header>
      <div className="property-list">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p>家賃：{property.rent}</p>
            <p>エリア：{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Properties
