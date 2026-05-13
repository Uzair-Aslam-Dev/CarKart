'use client'
import { useEffect, useState } from 'react'

interface User {
    user_id: number
    username: string
    full_name: string
    email: string
    phone: string
    city: string
    role: string
    created_at: string
}

const roleStyle: Record<string, { color: string; bg: string }> = {
    seller: { color: '#2563eb', bg: '#dbeafe' },
    buyer:  { color: '#16a34a', bg: '#dcfce7' },
    admin:  { color: '#7c3aed', bg: '#ede9fe' },
}

function Avatar({ name }: { name: string }) {
    const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'
    const colors = ['#dbeafe', '#dcfce7', '#fef3c7', '#ede9fe', '#fee2e2', '#e0f2fe']
    const textColors = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0284c7']
    const idx = name?.charCodeAt(0) % colors.length || 0
    return (
        <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: colors[idx], color: textColors[idx],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, flexShrink: 0,
        }}>
            {initials}
        </div>
    )
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchUsers = () => {
        setLoading(true)
        fetch('http://localhost:5000/users/users', { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                // FIX: handle both shapes — plain array OR { users: [...] }
                // If neither, fall back to [] so .filter() never crashes
                const list = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : [])
                setUsers(list)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch users:', err)
                setUsers([])
                setLoading(false)
            })
    }

    useEffect(() => { fetchUsers() }, [])

    const deleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return
        await fetch(`http://localhost:5000/users/users/${id}`, { method: 'DELETE', credentials: 'include' })
        fetchUsers()
    }

    const filtered = users.filter(u =>
        `${u.username} ${u.full_name} ${u.email} ${u.city} ${u.role}`
            .toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#111827' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>All Users</h2>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                    Manage registered buyers, sellers, and admins on the platform.
                </p>
            </div>

            {/* Table Card */}
            <div style={{
                background: '#fff', borderRadius: '14px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                overflow: 'hidden',
            }}>
                {/* Toolbar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                        User Accounts
                        <span style={{
                            marginLeft: '10px', fontSize: '12px', fontWeight: 600,
                            color: '#2563eb', background: '#eff6ff',
                            padding: '2px 8px', borderRadius: '20px',
                        }}>
                            {users.length}
                        </span>
                    </p>
                    <div style={{ position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                paddingLeft: '32px', paddingRight: '12px',
                                paddingTop: '8px', paddingBottom: '8px',
                                fontSize: '13px', borderRadius: '8px',
                                border: '1px solid #e5e7eb', outline: 'none',
                                width: '220px', color: '#111827', background: '#f9fafb',
                            }}
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                        <svg style={{ margin: '0 auto 12px', display: 'block', animation: 'spin 1s linear infinite' }}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Loading users...
                        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        {['User', 'Email', 'Role', 'City', 'Phone', 'Joined', 'Actions'].map(h => (
                                            <th key={h} style={{
                                                padding: '11px 16px', textAlign: 'left',
                                                fontSize: '11px', fontWeight: 600,
                                                color: '#6b7280', textTransform: 'uppercase',
                                                letterSpacing: '0.05em', whiteSpace: 'nowrap',
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : filtered.map((user, i) => {
                                        const r = roleStyle[user.role] ?? { color: '#6b7280', bg: '#f3f4f6' }
                                        return (
                                            <tr key={user.user_id}
                                                style={{
                                                    borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    transition: 'background 0.12s',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                {/* User */}
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <Avatar name={user.full_name} />
                                                        <div>
                                                            <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{user.full_name}</p>
                                                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>@{user.username}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td style={{ padding: '12px 16px', color: '#374151' }}>{user.email}</td>

                                                {/* Role */}
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{
                                                        display: 'inline-block', padding: '3px 10px',
                                                        borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                        color: r.color, background: r.bg, textTransform: 'capitalize',
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>

                                                {/* City */}
                                                <td style={{ padding: '12px 16px', color: '#374151' }}>{user.city || '—'}</td>

                                                {/* Phone */}
                                                <td style={{ padding: '12px 16px', color: '#374151' }}>{user.phone || '—'}</td>

                                                {/* Joined */}
                                                <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                                    {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding: '12px 16px' }}>
                                                    <button
                                                        onClick={() => deleteUser(user.user_id)}
                                                        style={{
                                                            padding: '5px 12px', borderRadius: '6px',
                                                            fontSize: '12px', fontWeight: 600,
                                                            border: 'none', cursor: 'pointer',
                                                            color: '#dc2626', background: '#fee2e2',
                                                            transition: 'opacity 0.15s',
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                                                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        {filtered.length > 0 && (
                            <div style={{
                                padding: '12px 20px', borderTop: '1px solid #f1f5f9',
                                fontSize: '13px', color: '#6b7280',
                            }}>
                                Showing {filtered.length} of {users.length} users
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}