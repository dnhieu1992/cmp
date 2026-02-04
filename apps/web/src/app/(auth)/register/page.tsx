import Link from "next/link";
import RegisterForm from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f6f4,_#ecebe6_60%,_#e1dfd6)] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">CMP</div>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">Start your journey with CMP.</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
