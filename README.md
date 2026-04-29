# tden-compute-worker

> Status: **Phase A2.6 scaffolding** — UI + Tauri shell + hardware-scan placeholder. Real worker daemon (gRPC long-poll, sandboxed exec, signed result submit) lands Phase B.

Earn TDEN tokens by providing your GPU / CPU / NPU to SIN nodes that need compute (LLM inference, embeddings, ZK proofs, federated-learning aggregation).

Designed for the "I just want to plug in and earn" UX (think NiceHash for AI workloads). Tray-resident, idle-aware, no daily attention required after setup.

Part of the **TDEN — Trusted Digital Ecosystem Network** ecosystem.

## Surface

| Tab | What |
|---|---|
| **Workers** | Auto-detected hardware (CPU / RAM / GPUs) + per-resource allocation sliders + start/stop |
| **Pools** | Connected SIN nodes; multi-pool with priority/round-robin scheduling (Phase B) |
| **Earnings** | Daily / weekly / monthly / total earnings + wallet hookup + cashout |
| **Settings** | Auto-start, idle detection, time windows, resource hard caps (temp / power / disk) |

## Why a separate app from `tden-validator-console`?

Different user persona:

- **Validator operator**: knows systemctl, runs full chain node, signs blocks, votes
- **Compute provider**: just owns hardware, wants set-and-forget

Different threat profile:
- Validator key compromise = slashing (high stakes)
- Worker compromise = at-most loss of pending earnings (low stakes)

Different lifecycle:
- Validator wants 24/7 uptime
- Compute may be off during work hours, on overnight

Combining them would force one persona's UX onto the other.

## Stack

- Tauri 2 + React 18 + Vite (UI)
- Rust + sysinfo + tokio (worker daemon, Phase B)
- Plain CSS (matches portal/web pattern)

## Dev

```bash
cd src
npm install
npm run dev          # http://localhost:1422 (UI only, browser)

# Full Tauri (requires Rust):
tauri dev
```

## Phase B roadmap

1. **Real GPU detection** — `nvidia-smi` parsing (Linux/Windows), `rocm-smi` for AMD, IOKit Metal for macOS
2. **Worker daemon** — gRPC long-connection to selected pool's compute scheduler, heartbeats, task receive
3. **Sandbox runtime** — Docker / gVisor isolation, cgroup CPU/RAM limits, GPU MIG slicing
4. **Task types**:
   - LLM inference (llama.cpp / vllm)
   - Image embedding (CLIP)
   - Fine-tuning (PEFT/LoRA)
   - ZK proof generation
   - Federated-learning gradient aggregation
5. **Earnings settlement** — sign each completed task with worker key; SIN node aggregates and submits chain tx; tokens credit to dedicated worker wallet (not main wallet — limits blast radius)
6. **ZK-of-correct-execution (Phase C)** — prove the job ran honestly without revealing intermediate state to the customer or pool

## Security

See `tden-spec/spec/security-threat-model.md` §1.8.

Key points:

- **Worker daemon DOES NOT hold main wallet keys.** Only a dedicated "earnings receive" address whose private key is in user's main TDEN app.
- **Job payloads are signed task tickets** — daemon refuses unsigned work, prevents DoS / cryptojacking via spoofed pool.
- **Resource caps are hard limits**, not advisory — daemon kills jobs that exceed temp / power / RAM thresholds immediately.

## License

AGPL-3.0.
