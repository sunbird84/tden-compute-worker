import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Workers from './pages/Workers'
import Pools from './pages/Pools'
import Earnings from './pages/Earnings'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar__brand">
          TDEN Compute Worker
          <small>提供算力 / 接 SIN 节点 / 赚 token</small>
        </div>
        <nav className="sidebar__nav">
          <NavLink to="/workers"  className={({ isActive }) => isActive ? 'active' : ''}>⚡ 算力 / Workers</NavLink>
          <NavLink to="/pools"    className={({ isActive }) => isActive ? 'active' : ''}>🌊 节点池 / Pools</NavLink>
          <NavLink to="/earnings" className={({ isActive }) => isActive ? 'active' : ''}>💰 收益 / Earnings</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>⚙ 设置 / Settings</NavLink>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/workers" replace />} />
          <Route path="/workers"  element={<Workers />} />
          <Route path="/pools"    element={<Pools />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}
