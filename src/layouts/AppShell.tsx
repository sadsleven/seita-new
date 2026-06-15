import { Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TopNav, type TopNavUser, type TopNavMenuEntry, type TopNavItem } from './TopNav';

export interface NavMenuConfig {
  label: string;
  icon?: string;
  to: string;
}

export interface NavItemConfig {
  key: string;
  label: string;
  icon?: string;
  to?: string;
  menu?: NavMenuConfig[];
  /** Extra path prefixes that also mark this item active. */
  match?: string[];
}

export interface AppShellProps {
  logoSrc?: string;
  items: NavItemConfig[];
  user: TopNavUser | null;
  userMenu?: TopNavMenuEntry[];
  onLogout?: () => void;
  /** Optional secondary context bar rendered under the top nav (e.g. event tabs). */
  secondaryBar?: React.ReactNode;
}

/** App shell: top nav + optional secondary bar + the routed page (Outlet). */
export function AppShell({ logoSrc, items, user, userMenu, onLogout, secondaryBar }: AppShellProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (it: NavItemConfig): boolean => {
    const paths = [it.to, ...(it.match ?? []), ...(it.menu?.map((m) => m.to) ?? [])].filter(
      Boolean,
    ) as string[];
    return paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')));
  };

  const navItems: TopNavItem[] = items.map((it) => ({
    key: it.key,
    label: it.label,
    icon: it.icon,
    active: isActive(it),
    onClick: it.to ? () => navigate(it.to!) : undefined,
    menu: it.menu?.map((m) => ({ label: m.label, icon: m.icon, onClick: () => navigate(m.to) })),
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <TopNav logoSrc={logoSrc} items={navItems} user={user} userMenu={userMenu} onLogout={onLogout} />
      {secondaryBar}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 'var(--content-max)',
          mx: 'auto',
          px: { xs: 2, md: 3.5 },
          py: 3.5,
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
