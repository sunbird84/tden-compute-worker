// pages/Pools.tsx — 节点池(SIN 节点)接入配置。
// pages/Pools.tsx — Pool (SIN node) connection config.
import { useState } from 'react'

interface Pool {
  id: string
  name: string
  endpoint: string
  status: 'connected' | 'disconnected' | 'unknown'
  active: boolean
}

export default function Pools() {
  const [pools, setPools] = useState<Pool[]>([
    { id: 'p1', name: 'TDEN 主网(默认)', endpoint: 'wss://chain.tden.network/compute', status: 'unknown', active: true },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', endpoint: '' })

  const onAdd = () => {
    if (!form.name.trim() || !form.endpoint.trim()) return
    setPools([...pools, {
      id: `p${Date.now().toString(36)}`,
      name: form.name.trim(),
      endpoint: form.endpoint.trim(),
      status: 'unknown',
      active: false,
    }])
    setForm({ name: '', endpoint: '' })
    setShowAdd(false)
  }

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>🌊 节点池 / Pools</h1>
        <button onClick={() => setShowAdd((v) => !v)}>{showAdd ? '取消' : '+ 添加节点池'}</button>
      </div>

      <div className="card">
        <p className="muted">
          每个节点池 = 一个 SIN node 的算力调度端点。Worker 启动后自动接入"已激活"的池;
          多池可以并存(轮转 / 优先级)。Phase B 加调度策略选择。
        </p>
      </div>

      {showAdd && (
        <div className="card">
          <h2>添加节点池</h2>
          <div className="kv">
            <div className="label">名称</div>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 自营本地节点" style={{ width: '100%' }} />
            <div className="label">Endpoint(WebSocket / gRPC)</div>
            <input value={form.endpoint} onChange={(e) => setForm({ ...form, endpoint: e.target.value })} placeholder="wss://chain.tden.network/compute" style={{ width: '100%' }} />
          </div>
          <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end', gap: 8 }}>
            <button className="ghost" onClick={() => setShowAdd(false)}>取消</button>
            <button onClick={onAdd}>添加</button>
          </div>
        </div>
      )}

      <div className="grid">
        {pools.map((p) => (
          <div key={p.id} className="card">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, border: 'none' }}>{p.name}</h2>
              <span className={`badge ${p.status === 'connected' ? 'ok' : p.status === 'disconnected' ? 'bad' : 'warn'}`}>
                {p.status === 'connected' ? '已连接' : p.status === 'disconnected' ? '未连接' : '未知'}
              </span>
            </div>
            <div className="kv" style={{ marginTop: 8 }}>
              <div className="label">Endpoint</div><code>{p.endpoint}</code>
              <div className="label">激活</div>
              <span>
                <input type="checkbox" checked={p.active} onChange={(e) =>
                  setPools(pools.map((q) => q.id === p.id ? { ...q, active: e.target.checked } : q))
                } /> {p.active ? '✓ 接收任务' : '已禁用'}
              </span>
            </div>
            <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end', gap: 8 }}>
              <button className="ghost">📊 历史任务</button>
              <button className="danger" onClick={() => setPools(pools.filter((q) => q.id !== p.id))}>移除</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16, borderColor: 'rgba(210,153,34,0.4)' }}>
        <h2>Phase B 计划</h2>
        <ul style={{ marginLeft: 24, color: 'var(--text-dim)' }}>
          <li>WebSocket 长连 + 自动重连</li>
          <li>任务签名 ticket 校验(防止恶意 payload)</li>
          <li>多池调度策略:轮转 / 收益优先 / 网络优先</li>
          <li>实时任务流可视化</li>
        </ul>
      </div>
    </>
  )
}
