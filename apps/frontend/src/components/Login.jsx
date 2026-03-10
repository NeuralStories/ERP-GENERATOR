import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            await login(email, password);
            navigate('/'); // Redirigir al dashboard principal si es exitoso
        } catch (error) {
            setErrorMsg(error.message || 'Error al iniciar sesiÃ³n. Revisa tus credenciales.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg)' }}>
            <div className="card" style={{ maxWidth: 400, width: '100%', padding: '30px' }}>
                <h2 className="stitle" style={{ fontSize: 18, color: 'var(--acc)', justifyContent: 'center', marginBottom: 30 }}>
                    INICIAR SESIÓN
                </h2>

                {errorMsg && <div className="alert a-e">{errorMsg}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="mod-field">
                        <label className="mod-lbl">Email Corporativo</label>
                        <input
                            className="mod-in"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@egea.com"
                            style={{ textTransform: 'none' }}
                        />
                    </div>

                    <div className="mod-field">
                        <label className="mod-lbl">Contraseña</label>
                        <input
                            className="mod-in"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ textTransform: 'none' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-p"
                        disabled={isSubmitting}
                        style={{ marginTop: 10, justifyContent: 'center' }}
                    >
                        {isSubmitting ? 'VERIFICANDO...' : 'ENTRAR AL HUB'}
                    </button>
                </form>
            </div>
        </div>
    );
}
