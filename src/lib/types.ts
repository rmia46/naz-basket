import React from "react";
import {
  Terminal,
  Dumbbell,
  FileText,
  Gamepad2,
  Clock,
  Palette,
  Music,
  Utensils,
  Calendar as CalendarIcon,
  MessageSquare,
  Settings,
  TrendingUp,
  CloudLightning,
  Lightbulb,
  DollarSign,
  Map,
  Film,
  Target,
  Calculator,
  Link as LinkIcon,
  Globe,
  BookOpen,
  Search,
  CheckSquare,
  Wrench,
  Laptop,
  FileCode,
  AppWindow,
  Play,
  Compass
} from "lucide-react";

// Interface for custom apps stored in Firestore
export interface CustomApp {
  id: string;
  uid: string;
  name: string;
  type: "html" | "url";
  content: string;
  icon: string;
  color: string;
  category: string;
  favorite: boolean;
  createdAt?: any;
}

// Flat background colors for squircle icons
export const ICON_COLORS = [
  { name: "Blue", bgClass: "bg-blue-500 text-white" },
  { name: "Green", bgClass: "bg-emerald-500 text-white" },
  { name: "Orange", bgClass: "bg-orange-500 text-white" },
  { name: "Red", bgClass: "bg-rose-500 text-white" },
  { name: "Purple", bgClass: "bg-purple-500 text-white" },
  { name: "Yellow", bgClass: "bg-amber-500 text-zinc-950" },
  { name: "Indigo", bgClass: "bg-indigo-500 text-white" },
  { name: "Slate", bgClass: "bg-zinc-600 text-white" },
];

// Map of available Lucide icons for app grids
export const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  Terminal,
  CheckSquare,
  Dumbbell,
  FileText,
  Gamepad2,
  Clock,
  Palette,
  Music,
  Utensils,
  Calendar: CalendarIcon,
  MessageSquare,
  Settings,
  TrendingUp,
  CloudLightning,
  Lightbulb,
  DollarSign,
  Map,
  Film,
  Target,
  Calculator,
  Link: LinkIcon,
  Globe,
  BookOpen,
  Search,
  Wrench,
  Laptop,
  FileCode,
  AppWindow,
  Play,
  Compass
};

export const PRESET_ICONS = [
  "Terminal", "CheckSquare", "Dumbbell", "FileText", "Gamepad2",
  "Clock", "Palette", "Music", "Utensils", "Calendar",
  "MessageSquare", "Settings", "TrendingUp", "CloudLightning",
  "Lightbulb", "DollarSign", "Map", "Film", "Target", "Calculator",
  "Link", "Globe", "BookOpen", "Search",
  "Wrench", "Laptop", "FileCode", "AppWindow", "Play", "Compass"
];

export const CATEGORIES = ["All", "Utilities", "Productivity", "Games", "Fitness", "Entertainment", "Other"];

