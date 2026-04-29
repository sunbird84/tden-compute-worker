// pages/Earnings.tsx — 收益面板。
// pages/Earnings.tsx — Earnings dashboard.
export default function Earnings() {
  return (
    <>
      <h1>💰 收益 / Earnings</h1>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Stat label="今日 / Today" value="0 TDN" sub="0 任务" />
        <Stat label="本周 / Week" value="0 TDN" sub="0 任务" />
        <Stat label="本月 / Month" value="0 TDN" sub="0 任务" />
        <Stat label="累计 / Total" value="0 TDN" sub="0 任务" />
      </div>

      <div className="card">
        <h2>钱包地址</h2>
        <div className="kv">
          <div className="label">收款地址</div>
          <code>tden1...(尚未连接钱包)</code>
          <div className="label">链上余额</div><span>0 TDN</span>
          <div className="label">可提取</div><span>0 TDN</span>
        </div>
        <div className="row" style={{ marginTop: 12, gap: 8 }}>
          <button>🔗 连接钱包</button>
          <button className="ghost" disabled>提现到主钱包</button>
        </div>
      </div>

      <div className="card">
        <h2>历史任务</h2>
        <p className="muted">Phase B:逐任务流水 + 类型(LLM 推理/嵌入/微调/ZK proof)+ 资源占用 + 收益。</p>
      </div>

      <div className="card" style={{ borderColor: 'rgba(210,153,34,0.4)' }}>
        <h2>关于隐私</h2>
        <p className="muted">
          Worker daemon 不会持有完整钱包私钥;只有"专用收款地址"的私钥用于签领奖,
          主钱包私钥永远在你的 TDEN 主应用里。Phase C 加 ZK proof 提交结果而不是原始 I/O,
          客户根据 zk-snark 验证就能确认你做了正确计算,不需要看到中间数据。
        </p>
      </div>
    </>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card">
      <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>
    </div>
  )
}
