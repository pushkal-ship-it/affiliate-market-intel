import { useState } from 'react';
import Head from 'next/head';
import { PASSWORD, DEFAULT_VERTICALS, FOCUS_OPTIONS, BRAND } from '../config';

function formatBriefing(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);

  const [verticals, setVerticals] = useState(DEFAULT_VERTICALS);
  const [selected, setSelected] = useState(DEFAULT_VERTICALS[0]);
  const [focus, setFocus] = useState(FOCUS_OPTIONS[0].value);
  const [newVertical, setNewVertical] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  function handleLogin(e) {
    e.preventDefault();
    if (pwInput === PASSWORD) {
      setAuthed(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  }

  function addVertical() {
    const val = newVertical.trim();
    if (!val || verticals.includes(val)) return;
    setVerticals(prev => [...prev, val]);
    setSelected(val);
    setNewVertical('');
    setShowAdd(false);
  }

  async function runBriefing() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertical: selected, focus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const entry = {
        vertical: selected,
        focus: FOCUS_OPTIONS.find(f => f.value === focus)?.label,
        text: data.text,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      };
      setResult(entry);
      setHistory(prev => [entry, ...prev]);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <>
        <Head><title>{BRAND.name} — Login</title></Head>
        <div style={styles.loginWrap}>
          <div style={styles.loginBox}>
            <div style={styles.loginLogo}>📊</div>
            <h1 style={styles.loginTitle}>{BRAND.name}</h1>
            <p style={styles.loginSub}>{BRAND.loginSubtitle}</p>
            <form onSubmit={handleLogin} style={styles.loginForm}>
              <input
                type="password"
                placeholder="Password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                style={{ ...styles.loginInput, ...(pwError ? styles.loginInputError : {}) }}
                autoFocus
              />
              {pwError && <p style={styles.loginError}>Incorrect password</p>}
              <button type="submit" style={styles.loginBtn}>Access tool</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>{BRAND.name}</title></Head>
      <div style={styles.wrap}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.h1}>{BRAND.name}</h1>
            <p style={styles.sub}>{BRAND.tagline}</p>
          </div>

          <div style={styles.chipsRow}>
            {verticals.map(v => (
              <button key={v} onClick={() => setSelected(v)}
                style={{ ...styles.chip, ...(selected === v ? styles.chipActive : {}) }}>
                {v}
              </button>
            ))}
            <button style={{ ...styles.chip, ...styles.chipDashed }} onClick={() => setShowAdd(s => !s)}>
              + Add
            </button>
          </div>

          {showAdd && (
            <div style={styles.addRow}>
              <input placeholder="e.g. Password Managers" value={newVertical}
                onChange={e => setNewVertical(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addVertical()}
                style={styles.addInput} autoFocus />
              <button style={styles.addBtn} onClick={addVertical}>Add</button>
              <button style={styles.addBtn} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          )}

          <div style={styles.focusRow}>
            <select value={focus} onChange={e => setFocus(e.target.value)} style={styles.select}>
              {FOCUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button style={{ ...styles.runBtn, ...(loading ? styles.runBtnDisabled : {}) }}
              onClick={runBriefing} disabled={loading}>
              {loading ? 'Fetching…' : 'Get briefing →'}
            </button>
          </div>

          <div style={styles.resultsArea}>
            {!result && !loading && !error && (
              <p style={styles.empty}>Select a vertical and click "Get briefing" to pull the latest market intelligence.</p>
            )}
            {loading && (
              <div style={styles.loadingCard}>Searching latest {selected} news…</div>
            )}
            {error && (
              <div style={{ ...styles.loadingCard, color: '#A32D2D' }}>Error: {error}</div>
            )}
            {result && !loading && (
              <div style={styles.briefCard}>
                <div style={styles.briefHeader}>
                  <span style={styles.vBadge}>{result.vertical}</span>
                  <span style={styles.fBadge}>{result.focus}</span>
                  <span style={styles.briefTime}>{result.time}</span>
                </div>
                <div style={styles.briefBody}
                  dangerouslySetInnerHTML={{ __html: formatBriefing(result.text) }} />
              </div>
            )}
          </div>

          {history.length > 1 && (
            <div style={styles.historySection}>
              <p style={styles.historyLabel}>Previous briefings this session</p>
              {history.slice(1).map((h, i) => (
                <div key={i} style={styles.historyItem} onClick={() => setResult(h)}>
                  <span style={styles.hBadge}>{h.vertical}</span>
                  <span style={styles.hTitle}>{h.focus}</span>
                  <span style={styles.hTime}>{h.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f3', fontFamily: 'system-ui, sans-serif' },
  loginBox: { background: '#fff', borderRadius: 16, padding: '2.5rem 2rem', width: 360, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' },
  loginLogo: { fontSize: 32, marginBottom: 12 },
  loginTitle: { fontSize: 20, fontWeight: 600, margin: '0 0 6px', color: '#1a1a1a' },
  loginSub: { fontSize: 14, color: '#888', margin: '0 0 24px' },
  loginForm: { display: 'flex', flexDirection: 'column', gap: 12 },
  loginInput: { padding: '10px 14px', fontSize: 15, borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', textAlign: 'center', letterSpacing: 2 },
  loginInputError: { border: '1px solid #e24b4a', background: '#fff5f5' },
  loginError: { fontSize: 13, color: '#e24b4a', margin: 0 },
  loginBtn: { padding: '10px', fontSize: 15, fontWeight: 500, borderRadius: 8, border: 'none', background: '#185FA5', color: '#fff', cursor: 'pointer' },
  wrap: { minHeight: '100vh', background: '#f5f5f3', fontFamily: 'system-ui, sans-serif', padding: '2rem 1rem' },
  container: { maxWidth: 760, margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  h1: { fontSize: 22, fontWeight: 600, color: '#1a1a1a', margin: 0 },
  sub: { fontSize: 13, color: '#888', marginTop: 4 },
  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', border: '1px solid #ddd', background: '#fff', color: '#555' },
  chipActive: { background: '#185FA5', borderColor: '#185FA5', color: '#fff' },
  chipDashed: { borderStyle: 'dashed' },
  addRow: { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' },
  addInput: { flex: 1, padding: '7px 12px', fontSize: 13, borderRadius: 8, border: '1px solid #ddd', outline: 'none' },
  addBtn: { padding: '7px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' },
  focusRow: { display: 'flex', gap: 8, marginBottom: 24 },
  select: { flex: 1, padding: '8px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #ddd', background: '#fff', outline: 'none' },
  runBtn: { padding: '8px 20px', fontSize: 14, fontWeight: 500, borderRadius: 8, border: 'none', background: '#185FA5', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' },
  runBtnDisabled: { opacity: 0.5, cursor: 'default' },
  resultsArea: { minHeight: 80 },
  empty: { color: '#aaa', fontSize: 14, textAlign: 'center', padding: '2rem 0' },
  loadingCard: { background: '#f0f0ee', borderRadius: 12, padding: '2rem', textAlign: 'center', fontSize: 14, color: '#888' },
  briefCard: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '1.25rem' },
  briefHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  vBadge: { fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 12, background: '#E6F1FB', color: '#0C447C' },
  fBadge: { fontSize: 11, padding: '3px 10px', borderRadius: 12, background: '#f0f0ee', color: '#888' },
  briefTime: { fontSize: 12, color: '#bbb', marginLeft: 'auto' },
  briefBody: { fontSize: 14, lineHeight: 1.75, color: '#1a1a1a' },
  historySection: { marginTop: 24, borderTop: '1px solid #e8e8e8', paddingTop: 16 },
  historyLabel: { fontSize: 12, color: '#bbb', marginBottom: 10 },
  historyItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f0f0ee', cursor: 'pointer' },
  hBadge: { fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#f0f0ee', color: '#888', whiteSpace: 'nowrap' },
  hTitle: { fontSize: 13, color: '#888', flex: 1 },
  hTime: { fontSize: 11, color: '#bbb' }
};
