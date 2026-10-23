-- Trigger-Funktionen nicht über die API (/rest/v1/rpc) aufrufbar machen; Trigger laufen weiter
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
revoke execute on function public.ensure_active_admin_remains() from public, anon, authenticated;
revoke execute on function public.news_set_published_at() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- has_role() brauchen nur RLS-Policies für angemeldete Benutzer
revoke execute on function public.has_role(public.app_role) from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated, service_role;
