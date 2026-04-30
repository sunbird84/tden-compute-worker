# tden-compute-worker

> 英文版:[README.md](README.md)

> 状态:**Phase A2.6 脚手架** —— UI + Tauri 外壳 + 硬件扫描占位完成。真正的 worker 守护进程(gRPC 长轮询、沙箱执行、签名结果上报)将在 Phase B 落地。

将你的 GPU / CPU / NPU 提供给需要算力的 SIN 节点(LLM 推理、Embeddings、ZK 证明、联邦学习聚合),赚取 TDEN 代币。

为"插上就赚钱"的 UX 而设计(类似 NiceHash 但面向 AI workload)。常驻系统托盘、识别空闲、配置后无需日常关注。

属于 **TDEN —— Trusted Digital Ecosystem Network** 生态。

## 界面

| Tab | 内容 |
|---|---|
| **Workers** | 自动检测的硬件(CPU / RAM / GPU)+ 各资源分配滑块 + 启停按钮 |
| **Pools** | 已连接的 SIN 节点;多池优先级 / 轮询调度(Phase B) |
| **Earnings** | 日 / 周 / 月 / 累计收益 + 钱包绑定 + 提现 |
| **Settings** | 自动启动、空闲检测、时间窗口、资源硬上限(温度 / 功率 / 磁盘) |

## 为什么独立于 `tden-validator-console`?

用户画像不同:

- **验证者运维**:熟悉 systemctl,运行全节点,签块,投票
- **算力提供者**:只是有硬件,设置完就不想再管

威胁画像不同:
- 验证者密钥泄漏 = 罚没(高风险)
- Worker 失陷 = 最多损失待结算收益(低风险)

生命周期不同:
- 验证者要 7×24 在线
- Worker 可工作时间关掉,夜里跑

合并会强迫一种用户接受另一种用户的 UX。

## 技术栈

- Tauri 2 + React 18 + Vite(UI)
- Rust + sysinfo + tokio(worker 守护进程,Phase B)
- 原生 CSS(与 portal/web 风格一致)

## 开发

```bash
cd src
npm install
npm run dev          # http://localhost:1422 (UI only, browser)

# Full Tauri (requires Rust):
tauri dev
```

## Phase B 路线图

1. **真实 GPU 检测** —— `nvidia-smi` 解析(Linux/Windows)、AMD 用 `rocm-smi`、macOS 用 IOKit Metal
2. **Worker 守护进程** —— 与所选池调度器的 gRPC 长连接、心跳、任务接收
3. **沙箱运行时** —— Docker / gVisor 隔离、cgroup CPU/RAM 限额、GPU MIG 切分
4. **任务类型**:
   - LLM 推理(llama.cpp / vllm)
   - 图像 embedding(CLIP)
   - 微调(PEFT/LoRA)
   - ZK 证明生成
   - 联邦学习梯度聚合
5. **收益结算** —— 每个完成的任务由 worker 密钥签名;SIN 节点聚合后提交链上 tx;代币入账到专门的 worker 钱包(非主钱包,限制爆炸半径)
6. **执行正确性 ZK 证明(Phase C)** —— 证明任务诚实运行,且不向客户或矿池暴露中间状态

## 安全

详见 `tden-spec/spec/security-threat-model.md` §1.8。

要点:

- **Worker 守护进程不持有主钱包密钥。** 仅一个专用"收款地址",其私钥保存在用户主 TDEN 应用中。
- **任务负载是签名 task ticket** —— 守护进程拒绝未签名任务,防止伪造池子的 DoS / 挖矿劫持。
- **资源上限是硬限制**,不是建议值 —— 守护进程对超出温度 / 功率 / 内存阈值的任务立即终止。

## 许可证

AGPL-3.0。
