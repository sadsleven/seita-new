import { useState, type MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  ButtonBase,
} from '@mui/material';
import { Avatar } from '@/components/ui';

export interface TopNavMenuEntry {
  label: string;
  icon?: string;
  onClick?: () => void;
  danger?: boolean;
}

export interface TopNavItem {
  key: string;
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
  menu?: TopNavMenuEntry[];
}

export interface TopNavUser {
  first_name: string;
  last_name: string;
  role: string;
}

export interface TopNavProps {
  logoSrc?: string;
  brand?: string;
  items?: TopNavItem[];
  user?: TopNavUser | null;
  userMenu?: TopNavMenuEntry[];
  onLogout?: () => void;
}

/**
 * White, sticky horizontal top navigation — the SEITA admin shell. Items can
 * carry a dropdown menu; the active item shows a soft-blue pill. A right-aligned
 * avatar opens the account menu (MUI Menu → focus trap + Esc for free).
 */
export function TopNav({
  logoSrc,
  brand = 'SEITA',
  items = [],
  user,
  userMenu = [],
  onLogout,
}: TopNavProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (key: string) => (e: MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget);
    setOpenKey(key);
  };
  const closeMenu = () => {
    setOpenKey(null);
    setAnchor(null);
  };
  const run = (fn?: () => void) => () => {
    closeMenu();
    fn?.();
  };

  const accountEntries: TopNavMenuEntry[] = [
    ...userMenu,
    ...(onLogout ? [{ label: 'Cerrar sesión', icon: 'mdi-exit-run', danger: true, onClick: onLogout }] : []),
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'var(--shadow-1)',
        height: 'var(--appbar-height)',
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 'var(--appbar-height) !important', px: { xs: 2, md: 2.5 } }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5, flexShrink: 0 }}>
          {logoSrc ? (
            <Box component="img" src={logoSrc} alt={brand} sx={{ height: 38, width: 'auto' }} />
          ) : (
            <Typography sx={{ fontWeight: 900, letterSpacing: '0.12em', fontSize: 22, color: 'brand.navy' }}>
              {brand}
            </Typography>
          )}
        </Box>

        {/* Primary items */}
        <Box
          component="nav"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flex: 1, minWidth: 0, overflowX: 'auto' }}
        >
          {items.map((it) => {
            const hasMenu = !!it.menu?.length;
            return (
              <ButtonBase
                key={it.key}
                onClick={hasMenu ? openMenu(it.key) : run(it.onClick)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  height: 40,
                  px: 2,
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  color: it.active ? 'primary.dark' : 'text.primary',
                  bgcolor: it.active ? 'brand.soft' : 'transparent',
                  transition: 'background 120ms',
                  '&:hover': { bgcolor: it.active ? 'brand.soft' : 'var(--neutral-50)' },
                }}
              >
                {it.icon && <span className={`mdi ${it.icon}`} aria-hidden style={{ fontSize: '1.2rem' }} />}
                {it.label}
                {hasMenu && (
                  <span
                    className={`mdi ${openKey === it.key ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}
                    aria-hidden
                    style={{ fontSize: '1.1rem', opacity: 0.7 }}
                  />
                )}
              </ButtonBase>
            );
          })}
        </Box>

        {/* Account */}
        {user && (
          <Box sx={{ flexShrink: 0 }}>
            <ButtonBase
              onClick={openMenu('__user')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '4px 4px 4px 10px', borderRadius: 999 }}
            >
              <Box sx={{ textAlign: 'right', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'text.primary' }}>
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{user.role}</Typography>
              </Box>
              <Avatar name={`${user.first_name} ${user.last_name}`} size={42} />
            </ButtonBase>
          </Box>
        )}

        {/* Shared dropdown (per-item menus + account menu) */}
        <Menu
          anchorEl={anchor}
          open={!!openKey}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: openKey === '__user' ? 'right' : 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: openKey === '__user' ? 'right' : 'left' }}
          slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5, boxShadow: 'var(--shadow-3)' } } }}
        >
          {(openKey === '__user' ? accountEntries : items.find((i) => i.key === openKey)?.menu ?? []).map(
            (m, i) => (
              <MenuItem
                key={i}
                onClick={run(m.onClick)}
                sx={{ gap: 1, py: 1.25, fontWeight: 600, color: m.danger ? 'error.main' : 'text.primary' }}
              >
                {m.icon && (
                  <ListItemIcon sx={{ minWidth: 'auto !important', color: m.danger ? 'error.main' : 'text.secondary' }}>
                    <span className={`mdi ${m.icon}`} aria-hidden style={{ fontSize: '1.25rem' }} />
                  </ListItemIcon>
                )}
                {m.label}
              </MenuItem>
            ),
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
