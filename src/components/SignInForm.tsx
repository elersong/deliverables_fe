import {type SubmitEvent, useState} from "react";
import {supabaseClient} from "../utils/supabase.ts";

export const SignInForm = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setIsPending(true);
        setMessage(null);
        const {error} = await supabaseClient.auth.signInWithPassword({
            email: String(form.get("email")),
            password: String(form.get("password")),
        });
        setIsPending(false);
        // When sign in is successful, <Admin /> swaps the form for the panel.
        if (error) setMessage(error.message);
    };

    return (
        <main>
            <h1>Admin sign-in</h1>
            <form onSubmit={handleSubmit}>
                <label>Email <input name="email" type="email" autoComplete="username" required/></label>
                <label>Password <input name="password" type="password" autoComplete="current-password" required/></label>
                <button type="submit" disabled={isPending}>{isPending ? "Signing in…" : "Sign in"}</button>
            </form>
            {message && <p role="alert">{message}</p>}
        </main>
    );
};