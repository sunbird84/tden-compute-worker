// pages/Workers.tsx — 本机算力扫描 + 分配。
// pages/Workers.tsx — Local hardware scan + capacity allocation.
//
// Phase A2.6:UI 骨架 + 调用 Tauri 命令 scan_hardware(占位实现);
// Phase B:Rust 侧实现真扫描(NVIDIA SMI / amdgpu / lscpu / Apple Metal Family),
//          + 实际启动 worker daemon(注册到 pool / 接收任务)。
import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

interface HardwareInfo {
  cpu: { model: string; cores: number; threads: number }
  ram_gb: number
  gpus: { vendor: string; model: string; vram_gb: number; cuda?: boolean; rocm?: boolean }[]
  os: string
}

export default function Workers() {
  const [hw, setHw] = useState<HardwareInfo | null>(null)
  const [scanning, setScanning] = useState(false)
  const [err, setErr] = useState('')
  const [allocCpu, setAllocCpu] = useState(70)
  const [allocGpu, setAllocGpu] = useState(80)
  const [running, setRunning] = useState(false)

  const scan = async () => {
    setScanning(true)
    setErr('')
    try {
      const result = await invoke<HardwareInfo>('scan_hardware')
      setHw(result)
    } catch (e: any) {
      // Tauri 不可用(浏览器开发) — 用 mock 数据
      // Tauri unavailable (browser dev) — fall back to mock so UI is testable
      setErr(`Tauri unavailable: ${e?.message || e} (showing mock)`)
      setHw({
        cpu: { model: 'Mock CPU (browser dev mode)', cores: 8, threads: 16 },
        ram_gb: 32,
        gpus: [{ vendor: 'NVIDIA', model: 'RTX 4090', vram_gb: 24, cuda: true }],
        os: 'browser-dev',
      })
    } finally {
      setScanning(false)
    }
  }

  useEffect(() => { scan() }, [])

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>⚡ 算力 / Workers</h1>
        <div className="row" style={{ gap: 8 }}>
          <button className="ghost" onClick={scan} disabled={scanning}>{scanning ? '扫描中…' : '🔄 重新扫描'}</button>
          <button onClick={() => setRunning((v) => !v)} className={running ? 'danger' : ''}>
            {running ? '⏹ 停止 worker' : '▶ 启动 worker'}
          </button>
        </div>
      </div>

      {err && <div className="card muted" style={{ borderColor: 'var(--warn)' }}>⚠ {err}</div>}

      {hw && (
        <>
          <div className="card">
            <h2>本机硬件</h2>
            <div className="kv">
              <div className="label">CPU</div>
              <span>{hw.cpu.model} — {hw.cpu.cores} cores / {hw.cpu.threads} threads</span>
              <div className="label">RAM</div><span>{hw.ram_gb} GB</span>
              <div className="label">OS</div><span>{hw.os}</span>
            </div>
          </div>

          <div className="card">
            <h2>GPU</h2>
            {hw.gpus.length === 0 ? (
              <p className="muted">未检测到独立 GPU(只有集成显卡)。可以仍以 CPU-only 模式接 worker,但收益会显著低。</p>
            ) : (
              <div className="grid">
                {hw.gpus.map((g, i) => (
                  <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
                    <span><strong>{g.vendor}</strong> {g.model} — {g.vram_gb} GB VRAM</span>
                    <div className="row" style={{ gap: 6 }}>
                      {g.cuda && <span className="badge ok">CUDA</span>}
                      {g.rocm && <span className="badge ok">ROCm</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2>分配比例</h2>
            <p className="muted">设置 TDEN 占用本机算力的上限。其余留给本机其它应用。</p>
            <div style={{ marginTop: 12 }}>
              <label className="muted">CPU 上限: {allocCpu}%</label>
              <input type="range" min={10} max={100} value={allocCpu} onChange={(e) => setAllocCpu(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="muted">GPU 上限: {allocGpu}%</label>
              <input type="range" min={0} max={100} value={allocGpu} onChange={(e) => setAllocGpu(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          <div className="card" style={{ borderColor: 'rgba(210,153,34,0.4)' }}>
            <h2>Phase A2.6 状态</h2>
            <p className="muted">
              UI 骨架完成,Tauri 端 scan_hardware 命令是占位返回,Phase B 实现:
            </p>
            <ul style={{ marginLeft: 24, marginTop: 8, color: 'var(--text-dim)' }}>
              <li>Rust 侧调 nvidia-smi / lscpu / sysctl / WMI 真实扫描</li>
              <li>启动 worker daemon:gRPC 长连到选中的 SIN node 注册 + 心跳</li>
              <li>任务执行:ONNX / llama.cpp / vllm / 自定义 docker 容器</li>
              <li>沙箱:gVisor / docker 隔离;资源 cgroup 限制</li>
              <li>收益累计:每次任务签名结果 + 上链结算</li>
            </ul>
          </div>
        </>
      )}
    </>
  )
}
