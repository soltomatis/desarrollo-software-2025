import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const getStyles = (type: ToastProps['type']) => {
    switch (type) {
        case 'success':
            return { backgroundColor: '#4CAF50', icon: '✅' }; // Verde
        case 'error':
            return { backgroundColor: '#F44336', icon: '❌' }; // Rojo
        case 'info':
            return { backgroundColor: '#2196F3', icon: 'ℹ️' }; // Azul
        default:
            return { backgroundColor: '#555', icon: '📢' };
    }
};

const ToastNotification: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const { backgroundColor, icon } = getStyles(type);

    // Un timeout para cerrar la notificación automáticamente después de 5 segundos
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: backgroundColor
        }}
        onClick={onClose} // Permite cerrar al hacer clic
        >
            <span style={{ marginRight: '10px', fontSize: '1.2em' }}>{icon}</span>
            {message}
        </div>
    );
};

export default ToastNotification;