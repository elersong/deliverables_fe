import {useEffect, useState} from "react";
import type {Session} from "@supabase/supabase-js";
import {supabaseClient} from "../utils/supabase.ts";
import {SignInForm} from "../components/SignInForm.tsx";
import {AdminPanel} from "../components/AdminPanel.tsx";

// undefined = still checking, null = signed out
type SessionState = Session | null | undefined;

const Admin = () => {
    const [session, setSession] = useState<SessionState>(undefined);

    useEffect(() => {
        supabaseClient.auth.getSession().then(({data}) => setSession(data.session));
        const {data} = supabaseClient.auth.onAuthStateChange((_event, next) => setSession(next));
        return () => data.subscription.unsubscribe();
    }, []);

    if (session === undefined) return <p>Checking sign-in…</p>;
    if (session === null) return <SignInForm/>;
    return <AdminPanel/>;
};

export default Admin;
