import Link from "next/link";
import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f6f4,_#ecebe6_60%,_#e1dfd6)] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">CMP</div>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Sign in</h1>
          <p className="mt-1 text-sm text-zinc-500">Welcome back. Sign in to continue.</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
