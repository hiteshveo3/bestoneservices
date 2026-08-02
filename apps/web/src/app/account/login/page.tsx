import { LoginForm } from "@/components/auth-form";
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const { next } = await searchParams; return <LoginForm next={next?.startsWith("/") ? next : "/account/dashboard/"} />; }
