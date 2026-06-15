import { useNavigate } from 'react-router-dom';
import { AppShell, type NavItemConfig } from '@/layouts';
import { useAuth } from '@/modules/auth';

/** Top-level navigation for the admin shell. */
const navItems: NavItemConfig[] = [
  { key: 'panel', label: 'Panel', icon: 'mdi-view-dashboard-outline', to: '/panel' },
  { key: 'eventos', label: 'Eventos', icon: 'mdi-calendar-multiple', to: '/eventos' },
  { key: 'plantas', label: 'Plantas', icon: 'mdi-factory', to: '/plantas' },
  { key: 'catalogos', label: 'Catálogos', icon: 'mdi-format-list-bulleted', to: '/catalogos' },
  {
    key: 'admin',
    label: 'Administración',
    icon: 'mdi-shield-account-outline',
    match: ['/usuarios', '/tipos-producto', '/configuracion'],
    menu: [
      { label: 'Usuarios', icon: 'mdi-account-group-outline', to: '/usuarios' },
      { label: 'Tipos de producto', icon: 'mdi-tag-outline', to: '/tipos-producto' },
      { label: 'Configuración', icon: 'mdi-tune-variant', to: '/configuracion' },
    ],
  },
];

export function ProtectedLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const topNavUser = user
    ? { first_name: user.firstName, last_name: user.lastName, role: user.role }
    : null;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppShell
      logoSrc="/intertech-logo.svg"
      items={navItems}
      user={topNavUser}
      userMenu={[
        { label: 'Mi perfil', icon: 'mdi-account-circle', onClick: () => navigate('/perfil') },
        { label: 'Configuración', icon: 'mdi-cog-outline', onClick: () => navigate('/configuracion') },
      ]}
      onLogout={handleLogout}
    />
  );
}
