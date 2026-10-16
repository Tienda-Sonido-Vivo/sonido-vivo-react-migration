import type { ReactNode } from "react";

export interface CampoFormulario2Props {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
  children: ReactNode;
}