-- FUNCIÓN MAESTRA DE BYPASS PARA CREACIÓN DE USUARIOS
-- Permite crear usuarios en auth.users sin usar la Service Role Key desde el frontend
-- Ejecuta este script desde el backend porque tenemos acceso como 'postgres'

CREATE OR REPLACE FUNCTION public.admin_create_user_v2(
    target_email TEXT,
    target_password TEXT,
    target_full_name TEXT,
    target_role TEXT
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- 1. Insertar en auth.users
    -- Supabase usa Bcrypt. Usamos la extensión pgcrypto de Supabase.
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        target_email,
        extensions.crypt(target_password, extensions.gen_salt('bf')),
        now(),
        NULL,
        NULL,
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', target_full_name),
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO new_user_id;

    -- 2. Insertar en public.profiles (si el trigger no lo hizo)
    INSERT INTO public.profiles (id, full_name, created_at)
    VALUES (new_user_id, target_full_name, now())
    ON CONFLICT (id) DO NOTHING;

    -- 3. Asignar rol
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, target_role)
    ON CONFLICT (user_id) DO UPDATE SET role = target_role;

    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCIÓN PARA BORRAR USUARIOS (BYPASS)
CREATE OR REPLACE FUNCTION public.admin_delete_user_v2(
    target_user_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
    -- Borrar de auth.users (el resto se borra por CASCADE o triggers)
    DELETE FROM auth.users WHERE id = target_user_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION public.admin_create_user_v2(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_user_v2(UUID) TO anon, authenticated, service_role;
