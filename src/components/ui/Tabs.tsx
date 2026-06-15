import { Tabs as MuiTabs, Tab, type TabsProps as MuiTabsProps } from '@mui/material';

export interface TabItem {
  value: string;
  label: string;
  /** Leading mdi icon class. */
  icon?: string;
}

export interface TabsProps extends Omit<MuiTabsProps, 'onChange' | 'value'> {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, value, onChange, ...rest }: TabsProps) {
  return (
    <MuiTabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      {...rest}
    >
      {items.map((it) => (
        <Tab
          key={it.value}
          value={it.value}
          iconPosition="start"
          icon={it.icon ? <span className={`mdi ${it.icon}`} aria-hidden style={{ fontSize: '1.25rem' }} /> : undefined}
          label={it.label}
          sx={{ minHeight: 56, gap: 0.5 }}
        />
      ))}
    </MuiTabs>
  );
}
