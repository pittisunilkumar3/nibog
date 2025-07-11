// Type definitions for lucide-react
// This is a workaround for TypeScript to recognize the lucide-react types

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  // Define the type for Lucide icons
  type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

  // Export the icons you're using
  export const ArrowLeft: LucideIcon;
  export const Edit: LucideIcon;
  export const MapPin: LucideIcon;
  export const Loader2: LucideIcon;
  
  // Add any other icons you use from lucide-react
}
