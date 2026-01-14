import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForToken, getTikTokUserInfo } from "@/lib/tiktok";
import { toast } from "sonner";
import { Header } from "@/components/Header";

interface TikTokAccount {
    id: string;
    nickname: string;
    avatar: string;
    accessToken: string;
    refreshToken: string;
}

const TikTokCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (processedRef.current) return;
        processedRef.current = true;

        if (error) {
            toast.error(`Erro no login TikTok: ${error}`);
            navigate("/dashboard");
            return;
        }

        if (code) {
            const handleAuth = async () => {
                try {
                    const codeVerifier = localStorage.getItem("tiktok_code_verifier");
                    if (!codeVerifier) {
                        throw new Error("Code verifier not found. Please try connecting again.");
                    }

                    toast.info("Processando login no TikTok...");
                    const tokenData = await exchangeCodeForToken(code, codeVerifier);

                    // Fetch user info to build account object
                    toast.info("Buscando informações da conta...");
                    const userInfo = await getTikTokUserInfo(tokenData.access_token);

                    // Build account object
                    const newAccount: TikTokAccount = {
                        id: userInfo.open_id,
                        nickname: userInfo.display_name,
                        avatar: userInfo.avatar_url,
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token
                    };

                    // Load existing accounts
                    const existingAccounts: TikTokAccount[] = JSON.parse(
                        localStorage.getItem("tiktok_accounts") || "[]"
                    );

                    // Check if account already exists (update tokens)
                    const accountIndex = existingAccounts.findIndex(acc => acc.id === newAccount.id);
                    if (accountIndex >= 0) {
                        existingAccounts[accountIndex] = newAccount;
                        toast.success("Conta reconectada com sucesso!");
                    } else {
                        existingAccounts.push(newAccount);
                        toast.success("Nova conta conectada!");
                    }

                    // Save updated accounts
                    localStorage.setItem("tiktok_accounts", JSON.stringify(existingAccounts));

                    // Cleanup old format and verifier
                    localStorage.removeItem("tiktok_tokens");
                    localStorage.removeItem("tiktok_code_verifier");

                    navigate("/dashboard");
                } catch (err) {
                    console.error(err);
                    toast.error("Falha ao conectar conta. Verifique o console.");
                }
            };

            handleAuth();
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <Header />
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Conectando ao TikTok...</h1>
                <p className="text-muted-foreground animate-pulse">Por favor aguarde, não feche a janela.</p>
            </div>
        </div>
    );
};

export default TikTokCallback;
