import { forwardRef, useState } from 'react';
import { TextField, type TextFieldProps } from './TextField';
import { IconButton } from './IconButton';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endIcon'>;

/** Password field with a show/hide toggle and a default lock icon. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ icon = 'mdi-lock-outline', ...rest }, ref) {
    const [show, setShow] = useState(false);
    return (
      <TextField
        ref={ref}
        type={show ? 'text' : 'password'}
        icon={icon}
        endIcon={
          <IconButton
            label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            icon={show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}
            onClick={() => setShow((s) => !s)}
            edge="end"
            size="small"
            tabIndex={-1}
          />
        }
        {...rest}
      />
    );
  },
);
