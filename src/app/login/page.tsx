import { LoginForm } from "./components/LoginForm"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
}
