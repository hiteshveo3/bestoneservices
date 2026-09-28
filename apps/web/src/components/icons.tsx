import type { JSX } from "react";
import { HugeiconsIcon, type HugeiconsProps, type IconSvgElement } from "@hugeicons/react";
import {
  Activity01Icon,
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  Award01Icon,
  BookOpen01Icon,
  Bookmark01Icon,
  Briefcase01Icon,
  Building03Icon,
  Building05Icon,
  CalculatorIcon,
  Calendar03Icon,
  Call02Icon,
  CallRinging02Icon,
  Camera01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  ChartHistogramIcon,
  ChartIncreaseIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Database01Icon,
  Delete02Icon,
  DeliveryTruck01Icon,
  Download04Icon,
  File02Icon,
  FilterHorizontalIcon,
  FireIcon,
  FlashIcon,
  FloppyDiskIcon,
  HelpCircleIcon,
  Home01Icon,
  InformationCircleIcon,
  Invoice03Icon,
  Key01Icon,
  Layers01Icon,
  Leaf01Icon,
  LeftToRightListBulletIcon,
  LinkSquare02Icon,
  Loading03Icon,
  Location01Icon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  Message01Icon,
  MinusSignIcon,
  Navigation03Icon,
  Notification01Icon,
  PackageIcon,
  PencilEdit02Icon,
  PercentIcon,
  PieChartIcon,
  PlusSignIcon,
  PoundIcon,
  PrinterIcon,
  RotateLeft01Icon,
  Search01Icon,
  SearchAddIcon,
  SecurityCheckIcon,
  SecurityWarningIcon,
  SentIcon,
  Settings01Icon,
  Share08Icon,
  Shield01Icon,
  SparklesIcon,
  SprayCanIcon,
  SquareLock02Icon,
  StarIcon,
  Tag01Icon,
  TaskDaily01Icon,
  Tick02Icon,
  TickDouble02Icon,
  Tree06Icon,
  UserCheck01Icon,
  UserGroupIcon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
  WhatsappIcon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";

/**
 * The site uses Hugeicons and nothing else. These are the named icons the
 * pages use, each drawn by HugeiconsIcon; add a new one here rather than
 * importing another icon set. Pests are never pictured, so pest control
 * uses the shield.
 */

export type IconProps = Omit<HugeiconsProps, "icon" | "ref">;
export type IconComponent = ((props: IconProps) => JSX.Element) & { displayName?: string };

function icon(svg: IconSvgElement, name: string): IconComponent {
  const Icon = (props: IconProps) => <HugeiconsIcon icon={svg} aria-hidden="true" {...props} />;
  Icon.displayName = name;
  return Icon;
}

export const Activity = icon(Activity01Icon, "Activity");
export const AlertCircle = icon(AlertCircleIcon, "AlertCircle");
export const AlertTriangle = icon(Alert02Icon, "AlertTriangle");
export const ArrowLeft = icon(ArrowLeft02Icon, "ArrowLeft");
export const ArrowRight = icon(ArrowRight02Icon, "ArrowRight");
export const ArrowUpDown = icon(ArrowUpDownIcon, "ArrowUpDown");
export const ArrowUpRight = icon(ArrowUpRight01Icon, "ArrowUpRight");
export const Award = icon(Award01Icon, "Award");
export const BadgeCheck = icon(CheckmarkBadge01Icon, "BadgeCheck");
export const BarChart3 = icon(ChartHistogramIcon, "BarChart3");
export const Bell = icon(Notification01Icon, "Bell");
export const BookOpen = icon(BookOpen01Icon, "BookOpen");
export const Bookmark = icon(Bookmark01Icon, "Bookmark");
export const Briefcase = icon(Briefcase01Icon, "Briefcase");
export const Bug = icon(Shield01Icon, "Bug");
export const Building = icon(Building03Icon, "Building");
export const Building2 = icon(Building05Icon, "Building2");
export const Calculator = icon(CalculatorIcon, "Calculator");
export const Calendar = icon(Calendar03Icon, "Calendar");
export const Camera = icon(Camera01Icon, "Camera");
export const Check = icon(Tick02Icon, "Check");
export const CheckCheck = icon(TickDouble02Icon, "CheckCheck");
export const CheckCircle2 = icon(CheckmarkCircle02Icon, "CheckCircle2");
export const ChevronDown = icon(ArrowDown01Icon, "ChevronDown");
export const ChevronLeft = icon(ArrowLeft01Icon, "ChevronLeft");
export const ChevronRight = icon(ArrowRight01Icon, "ChevronRight");
export const ChevronUp = icon(ArrowUp01Icon, "ChevronUp");
export const ClipboardList = icon(TaskDaily01Icon, "ClipboardList");
export const Clock = icon(Clock01Icon, "Clock");
export const Copy = icon(Copy01Icon, "Copy");
export const CreditCard = icon(CreditCardIcon, "CreditCard");
export const Database = icon(Database01Icon, "Database");
export const Download = icon(Download04Icon, "Download");
export const Edit3 = icon(PencilEdit02Icon, "Edit3");
export const ExternalLink = icon(LinkSquare02Icon, "ExternalLink");
export const Eye = icon(ViewIcon, "Eye");
export const EyeOff = icon(ViewOffSlashIcon, "EyeOff");
export const FileSpreadsheet = icon(Xls01Icon, "FileSpreadsheet");
export const FileText = icon(File02Icon, "FileText");
export const Filter = icon(FilterHorizontalIcon, "Filter");
export const Flame = icon(FireIcon, "Flame");
export const HelpCircle = icon(HelpCircleIcon, "HelpCircle");
export const Home = icon(Home01Icon, "Home");
export const Info = icon(InformationCircleIcon, "Info");
export const Key = icon(Key01Icon, "Key");
export const Layers = icon(Layers01Icon, "Layers");
export const LayoutDashboard = icon(DashboardSquare01Icon, "LayoutDashboard");
export const Leaf = icon(Leaf01Icon, "Leaf");
export const List = icon(LeftToRightListBulletIcon, "List");
export const Loader2 = icon(Loading03Icon, "Loader2");
export const Lock = icon(SquareLock02Icon, "Lock");
export const LogOut = icon(Logout01Icon, "LogOut");
export const Mail = icon(Mail01Icon, "Mail");
export const MapPin = icon(Location01Icon, "MapPin");
export const Menu = icon(Menu01Icon, "Menu");
export const MessageCircle = icon(WhatsappIcon, "MessageCircle");
export const MessageSquare = icon(Message01Icon, "MessageSquare");
export const Minus = icon(MinusSignIcon, "Minus");
export const Navigation = icon(Navigation03Icon, "Navigation");
export const Package = icon(PackageIcon, "Package");
export const Percent = icon(PercentIcon, "Percent");
export const Phone = icon(Call02Icon, "Phone");
export const PhoneCall = icon(CallRinging02Icon, "PhoneCall");
export const PieChart = icon(PieChartIcon, "PieChart");
export const Plus = icon(PlusSignIcon, "Plus");
export const PoundSterling = icon(PoundIcon, "PoundSterling");
export const Printer = icon(PrinterIcon, "Printer");
export const Receipt = icon(Invoice03Icon, "Receipt");
export const RotateCcw = icon(RotateLeft01Icon, "RotateCcw");
export const Save = icon(FloppyDiskIcon, "Save");
export const Search = icon(Search01Icon, "Search");
export const Send = icon(SentIcon, "Send");
export const Settings = icon(Settings01Icon, "Settings");
export const Share2 = icon(Share08Icon, "Share2");
export const ShieldAlert = icon(SecurityWarningIcon, "ShieldAlert");
export const ShieldCheck = icon(SecurityCheckIcon, "ShieldCheck");
export const Sparkles = icon(SparklesIcon, "Sparkles");
export const SprayCan = icon(SprayCanIcon, "SprayCan");
export const Star = icon(StarIcon, "Star");
export const Tag = icon(Tag01Icon, "Tag");
export const Trash2 = icon(Delete02Icon, "Trash2");
export const Trees = icon(Tree06Icon, "Trees");
export const TrendingUp = icon(ChartIncreaseIcon, "TrendingUp");
export const Truck = icon(DeliveryTruck01Icon, "Truck");
export const User = icon(UserIcon, "User");
export const UserCheck = icon(UserCheck01Icon, "UserCheck");
export const Users = icon(UserGroupIcon, "Users");
export const X = icon(Cancel01Icon, "X");
export const XCircle = icon(CancelCircleIcon, "XCircle");
export const Zap = icon(FlashIcon, "Zap");
export const ZoomIn = icon(SearchAddIcon, "ZoomIn");

/** A row of five filled stars for a rating; the label carries the number. */
export function Stars({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span role="img" aria-label={label} className={`inline-flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <HugeiconsIcon key={i} icon={StarIcon} size="1em" fill="currentColor" aria-hidden="true" />
      ))}
    </span>
  );
}
