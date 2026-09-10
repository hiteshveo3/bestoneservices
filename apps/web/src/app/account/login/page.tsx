import { LoginForm } from "@/components/auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const target = params.redirect || params.next || "/account";
  return <LoginForm next={target.startsWith("/") ? target : "/account"} />;
}
