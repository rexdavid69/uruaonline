import AppLogoIcon from "./app-logo-icon";

interface AppLogoProps {
  size?: string; // Tailwind size classes, e.g., "w-16 h-16"
}

export default function AppLogo({ size = "" }: AppLogoProps) {
  return (
    <div className="flex justify-center rounded-md">
      <AppLogoIcon className={`${size}`} />
    </div>
  );
}