import React, { useState } from 'react';
import axios from 'axios';
import './SubscribeForm.css'; // Archivo de estilos que crearemos después

const SubscribeForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await axios.post('/api/subscribers/subscribe', { email });
            setMessage(response.data.message);
            setIsSuccess(true);
            setEmail('');

            // Resetear el estado de éxito después de 5 segundos
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            setIsSuccess(false);
            if (error.response) {
                if (error.response.data.alreadySubscribed) {
                    setMessage('Ya estás suscrito con este email. ¡Gracias!');
                    setIsSuccess(true);
                } else {
                    setMessage(error.response.data.error || 'Error al suscribirse');
                }
            } else {
                setMessage('Error de conexión. Por favor intenta nuevamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="subscribe-container">
            <div className="subscribe-card">
                <h2 className="subscribe-title">Suscríbete a nuestro boletín</h2>
                <p className="subscribe-description">Para saber de nuestras promociones.</p>

                <form onSubmit={handleSubmit} className="subscribe-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Introduce tu correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Tu correo electrónico"
                            className="form-input"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Procesando...
                            </>
                        ) : 'Unirse'}
                    </button>
                </form>

                {message && (
                    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <p className="disclaimer">
                    *Al completar el formulario te registras para recibir nuestros correos electrónicos
                    y puedes darte de baja en cualquier momento.
                </p>
            </div>
        </div>
    );
};

export default SubscribeForm;