import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ padding: '40px' }}> 
      <p>Selecciona una funcionalidad para continuar:</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
        
        {/* Este enlace lleva a la página con la búsqueda */}
        <Link href="/habitaciones/estado" className="nav-option nav-option-secondary">
          Visualizar Estado de Habitaciones
        </Link>
        
        {/* Otros enlaces */}
        <Link href="/reservas" className="nav-option nav-option-secondary">
          Reservar Habitaciones
        </Link>
        <Link href="/check-in" className="nav-option nav-option-secondary">
          Realizar Check-In
        </Link>
      </nav>
    </div>
  );
}