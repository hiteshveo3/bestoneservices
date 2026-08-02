import { LoginForm } from "@/components/login-form";
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) { const { next } = await searchParams; return <main id="main-content" className="auth-page"><LoginForm next={next?.startsWith("/") ? next : "/account/dashboard/"} /></main>; }
