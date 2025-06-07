import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

function App() {
    const [wikiUrl, setWikiUrl] = useState('')
    const [query, setQuery]   = useState('')
    const [chat, setChat]     = useState([])
    const scrollRef = useRef(null)
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    // Auto-scroll al final cuando cambian los mensajes
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chat])

    const handleSubmit = async e => {
        e.preventDefault()
        if (!query) return

        // Añade mensaje del usuario
        setChat(c => [...c, { from: 'user', text: query }])
        setQuery('')

        try {
            const res = await axios.post(`${API}/chat`, {
                url: wikiUrl,
                question: query
            })
            setChat(c => [...c, { from: 'bot', text: res.data.answer }])
        } catch (err) {
            setChat(c => [...c, { from: 'bot', text: '❗ Error: ' + err.message }])
        }
    }

    return (
        <div className="app-container">
            <header className="header">📚 RAG-Chat con Wikipedia</header>

            <main className="main">
                {/* URL input */}
                <div className="input-group">
                    <label>URL artículo (en inglés):</label>
                    <input
                        type="url"
                        value={wikiUrl}
                        onChange={e => setWikiUrl(e.target.value)}
                        placeholder="https://en.wikipedia.org/…"
                    />
                </div>

                {/* Chat window */}
                <div className="chat-window">
                    {chat.map((m, i) => (
                        <div key={i} className={`chat-msg ${m.from}`}>
                            <div className="sender">{m.from === 'user' ? 'Tú' : 'Bot'}</div>
                            <div className="message">{m.text}</div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Formulario */}
                <form className="chat-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        required
                    />
                    <button type="submit">▶</button>
                </form>
            </main>
        </div>
    )
}

export default App
