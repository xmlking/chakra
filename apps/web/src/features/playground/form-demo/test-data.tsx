import type { Option } from "@workspace/ui/components/sumo/multi-select-pro";
import {
  Activity,
  Bot,
  Calendar,
  Cat,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  Copy,
  Cpu,
  Database,
  Dog,
  DollarSign,
  Eye,
  EyeOff,
  Fish,
  Globe,
  HardDrive,
  Heart,
  type LucideProps,
  Mail,
  Maximize,
  MessageCircle,
  Minimize,
  Monitor,
  MoonIcon,
  PieChart,
  Rabbit,
  Search,
  Shield,
  Smartphone,
  Star,
  SunMedium,
  Target,
  TrendingUp,
  Turtle,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

export const Icons = {
  moonIcon: MoonIcon,
  sunIcon: SunMedium,
  cat: Cat,
  dog: Dog,
  fish: Fish,
  rabbit: Rabbit,
  turtle: Turtle,
  code: Code,
  globe: Globe,
  users: Users,
  star: Star,
  heart: Heart,
  zap: Zap,
  cpu: Cpu,
  database: Database,
  monitor: Monitor,
  smartphone: Smartphone,
  wand: Wand2,
  calendar: Calendar,
  harddrive: HardDrive,
  trendingUp: TrendingUp,
  dollarSign: DollarSign,
  target: Target,
  shield: Shield,
  mail: Mail,
  pieChart: PieChart,
  activity: Activity,
  search: Search,
  messageCircle: MessageCircle,
  bot: Bot,
  maximize: Maximize,
  minimize: Minimize,
  x: X,
  eyeOff: EyeOff,
  eye: Eye,
  copy: Copy,
  check: Check,
  clock: Clock,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      data-icon="github"
      data-prefix="fab"
      focusable="false"
      viewBox="0 0 496 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
        fill="currentColor"
      />
    </svg>
  ),
};

export const frameworksList = [
  { value: "next.js", label: "Next.js", icon: Icons.code },
  { value: "react", label: "React", icon: Icons.zap, disabled: true },
  { value: "vue", label: "Vue.js", icon: Icons.globe },
  { value: "angular", label: "Angular", icon: Icons.target },
  { value: "svelte", label: "Svelte", icon: Icons.star },
  { value: "nuxt.js", label: "Nuxt.js", icon: Icons.turtle },
  { value: "remix", label: "Remix", icon: Icons.rabbit, disabled: true },
  { value: "astro", label: "Astro", icon: Icons.fish },
  { value: "gatsby", label: "Gatsby", icon: Icons.dog },
  { value: "solid", label: "SolidJS", icon: Icons.cpu },
];

export const techStackOptions = [
  { value: "typescript", label: "TypeScript", icon: Icons.code },
  { value: "javascript", label: "JavaScript", icon: Icons.zap },
  { value: "python", label: "Python", icon: Icons.cpu },
  { value: "java", label: "Java", icon: Icons.database },
  { value: "csharp", label: "C#", icon: Icons.shield },
  { value: "golang", label: "Go", icon: Icons.activity },
  { value: "rust", label: "Rust", icon: Icons.harddrive },
  { value: "php", label: "PHP", icon: Icons.globe },
];

export const techOptions: Option[] = [
  { label: "nextjs", value: "nextjs", rating: "high" },
  { label: "React", value: "react", rating: "high" },
  { label: "Remix", value: "remix", rating: "medium" },
  { label: "Vite", value: "vite", rating: "medium" },
  { label: "Nuxt", value: "nuxt", rating: "low" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte", fixed: true },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember", disable: true },
  { label: "Gatsby", value: "gatsby", disable: true },
  { label: "Astro", value: "astro", rating: "medium" },
];

export const positionOptions = [
  { label: "Frontend Developer", value: "frontend" },
  { label: "Backend Developer", value: "backend" },
  {
    label: "Full Stack Developer",
    value: "fullstack",
  },
  // { label: "UI/UX Designer", value: "designer" },
  // { label: "Product Manager", value: "pm" },
];

export const planOptions = [
  {
    value: "starter",
    label: "Starter (100K tokens/month)",
    description: "For everyday use with basic features.",
  },
  {
    value: "pro",
    label: "Pro (1M tokens/month)",
    description: "For advanced AI usage with more features.",
  },
  {
    value: "enterprise",
    label: "Enterprise (Unlimited tokens)",
    description: "For large teams and heavy usage.",
  },
];
