import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function SiteHeader() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          ComboCuba
        </Link>
        <AuthStatus />
      </div>
    </div>
  );
}
