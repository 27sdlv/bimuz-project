import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="#" className={`logo ${className}`.trim()} aria-label="BimUz — bosh sahifa">
      <Image
        src="/logo.png"
        alt=""
        width={140}
        height={48}
        className="logo-img"
        priority
        aria-hidden
      />
      <span className="logo-text">
        BimUz
      </span>
    </Link>
  );
}
