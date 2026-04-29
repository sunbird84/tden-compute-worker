// pages/Settings.tsx
export default function Settings() {
  return (
    <>
      <h1>⚙ 设置 / Settings</h1>

      <div className="card">
        <h2>守护进程</h2>
        <div className="kv">
          <div className="label">开机自启</div>
          <span><input type="checkbox" /> 系统启动时自动跑 worker</span>
          <div className="label">空闲检测</div>
          <span><input type="checkbox" /> 仅在系统空闲时跑(避免影响日常使用)</span>
          <div className="label">时间窗</div>
          <span><input type="checkbox" /> 限制时段(如 22:00 - 07:00)</span>
        </div>
      </div>

      <div className="card">
        <h2>资源限制</h2>
        <p className="muted">硬上限,任何时候都不会超过这些值。</p>
        <div className="kv">
          <div className="label">最大温度 / Max temp</div><span>85 °C</span>
          <div className="label">最大功耗 / Max power</div><span>250 W</span>
          <div className="label">磁盘占用</div><span>50 GB</span>
        </div>
      </div>

      <div className="card">
        <h2>关于</h2>
        <div className="kv">
          <div className="label">版本</div><span>v0.1.0 (Phase A2.6 scaffolding)</span>
          <div className="label">仓库</div><a href="https://github.com/sunbird84/tden-compute-worker" target="_blank">github.com/sunbird84/tden-compute-worker</a>
          <div className="label">License</div><span>AGPL-3.0</span>
        </div>
      </div>
    </>
  )
}
