// Type definitions for lucide-react
// This is a workaround for TypeScript to recognize the lucide-react types

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  // Define the type for Lucide icons
  type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

  // Export all the icons used in the project
  export const ArrowLeft: LucideIcon;
  export const Edit: LucideIcon;
  export const MapPin: LucideIcon;
  export const Loader2: LucideIcon;
  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const Medal: LucideIcon;
  export const Trophy: LucideIcon;
  export const Award: LucideIcon;
  export const Star: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Trash: LucideIcon;

  // Admin header icons
  export const Bell: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const User: LucideIcon;
  export const LogOut: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Home: LucideIcon;
  export const Command: LucideIcon;

  // Admin sidebar icons
  export const BarChart3: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Users: LucideIcon;
  export const Tag: LucideIcon;
  export const CreditCard: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Package: LucideIcon;
  export const FileText: LucideIcon;
  export const QrCode: LucideIcon;
  export const UserCheck: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Building2: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Mail: LucideIcon;
  export const Layout: LucideIcon;

  // Common icons
  export const Plus: LucideIcon;
  export const Filter: LucideIcon;
  export const Eye: LucideIcon;
  export const Trash2: LucideIcon;
  export const Check: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Activity: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Pause: LucideIcon;
  export const Play: LucideIcon;
  export const Copy: LucideIcon;
  export const Building: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Users: LucideIcon;
  export const Edit: LucideIcon;

  // Add any other icons you use from lucide-react
}
