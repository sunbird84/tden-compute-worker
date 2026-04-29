#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tden_compute_worker_lib::run()
}
