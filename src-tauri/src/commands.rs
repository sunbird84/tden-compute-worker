// commands.rs — Tauri 命令(JS 可调)。
// commands.rs — Tauri commands callable from JS.
//
// Phase A2.6:scan_hardware 用 sysinfo crate 抓 CPU + RAM,GPU 暂返回占位。
// Phase B:GPU 扫描分平台:nvidia-smi 解析 / Windows WMI / macOS Metal IOKit。
//
// Phase A2.6: scan_hardware uses sysinfo for CPU + RAM; GPUs are placeholders.
// Phase B: GPU scan per platform:
//   - Linux/Windows: parse `nvidia-smi --query-gpu=...` + AMD `rocm-smi`
//   - Windows: WMI `Win32_VideoController`
//   - macOS: IOKit Metal device enumeration

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CpuInfo {
    pub model: String,
    pub cores: usize,
    pub threads: usize,
}

#[derive(Serialize, Deserialize)]
pub struct GpuInfo {
    pub vendor: String,
    pub model: String,
    pub vram_gb: u32,
    pub cuda: bool,
    pub rocm: bool,
}

#[derive(Serialize, Deserialize)]
pub struct HardwareInfo {
    pub cpu: CpuInfo,
    pub ram_gb: u32,
    pub gpus: Vec<GpuInfo>,
    pub os: String,
}

#[tauri::command]
pub async fn scan_hardware() -> Result<HardwareInfo, String> {
    let mut sys = sysinfo::System::new();
    sys.refresh_all();

    let cpu_brand = sys
        .cpus()
        .first()
        .map(|c| c.brand().to_string())
        .unwrap_or_else(|| "unknown".to_string());

    let cpu_threads = sys.cpus().len();
    // Phase A: physical_core_count is conservative; sysinfo 0.30 returns Option
    let cpu_cores = sysinfo::System::physical_core_count().unwrap_or(cpu_threads);

    let ram_gb = (sys.total_memory() / 1_073_741_824) as u32;

    let os = format!(
        "{} {}",
        sysinfo::System::name().unwrap_or_else(|| "?".into()),
        sysinfo::System::os_version().unwrap_or_else(|| "?".into())
    );

    // Phase A: GPU enumeration not implemented; return empty.
    // Phase B: dispatch to nvidia-smi / rocm-smi / WMI / IOKit.
    let gpus: Vec<GpuInfo> = Vec::new();

    Ok(HardwareInfo {
        cpu: CpuInfo {
            model: cpu_brand,
            cores: cpu_cores,
            threads: cpu_threads,
        },
        ram_gb,
        gpus,
        os,
    })
}
