import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Sistema de Gestión Hotelera</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Selecciona una funcionalidad para continuar:</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>

        <Link href="/habitaciones/estado" className="nav-option nav-option-secondary">
          📊 Visualizar Estado de Habitaciones
        </Link>

        <Link href="/reservas" className="nav-option nav-option-secondary">
          📅 Reservar Habitaciones
        </Link>

        <Link href="/cancelar-reserva" className="nav-option nav-option-secondary">
          ❌ Cancelar Reserva
        </Link>

        <Link href="/check-in" className="nav-option nav-option-secondary">
          🏨 Realizar Check-In
        </Link>
      </nav>
    </div>
  );
}