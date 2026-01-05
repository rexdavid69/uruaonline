interface AppLogoIconProps {
    className?: string;
  }

  export default function AppLogoIcon({ className = "" }: AppLogoIconProps) {
    return (
      <img
        src="/uruaonline_logo_full.png"
        alt="Uruaonline Logo"
        className={`object-contain cursor-pointer ${className}`}
      />
    );
  }