export const dynamic = 'force-dynamic';

import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const supabase = createRouteHandlerClient(
  { cookies },
  {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_ANON_KEY!,
  }
);


  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div>Lu belum login bro 🔒</div>;

  return (
    <div>
      <h1>Welcome bro</h1>
      <p>{user.email}</p>
    </div>
  );
}
