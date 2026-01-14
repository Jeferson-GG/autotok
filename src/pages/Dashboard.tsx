import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { generateVideoScript, VideoScript } from "@/lib/gemini";
import { initVideoUpload, getTikTokUserInfo, TikTokUser, refreshTikTokToken } from "@/lib/tiktok";
import {
    LayoutDashboard,
    Upload,
    Wand2,
    Settings,
    Link as LinkIcon,
    FileVideo,
    Smartphone,
    Users,
    Trash2,
    RefreshCw,
    Plus
} from "lucide-react";

interface TikTokAccount {
    id: string; // open_id
    nickname: string;
    avatar: string;
    accessToken: string;
    refreshToken: string;
}

const Dashboard = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState<'upload' | 'ai' | 'accounts'>('upload');
    const [uploadMode, setUploadMode] = useState<'file' | 'link'>('link');

    // Account State
    const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    // Data State
    const [videoUrl, setVideoUrl] = useState("https://files.ggsolution.site/video.mp4");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("https://files.ggsolution.site/video.mp4");
    const [isUploading, setIsUploading] = useState(false);

    // AI State
    const [prompt, setPrompt] = useState("");
    const [script, setScript] = useState<VideoScript | null>(null);
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
            return;
        }

        // Load Accounts
        const loadAccounts = async () => {
            const storedAccounts = JSON.parse(localStorage.getItem("tiktok_accounts") || "[]");

            // Migration: Check for old single token
            const oldTokens = localStorage.getItem("tiktok_tokens");
            if (oldTokens && storedAccounts.length === 0) {
                try {
                    const tokens = JSON.parse(oldTokens);
                    // Fetch user info to build account object
                    const userInfo = await getTikTokUserInfo(tokens.access_token);
                    const newAccount: TikTokAccount = {
                        id: userInfo.open_id,
                        nickname: userInfo.display_name,
                        avatar: userInfo.avatar_url,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token
                    };
                    const newAccounts = [newAccount];
                    setAccounts(newAccounts);
                    setSelectedAccountId(newAccount.id);
                    localStorage.setItem("tiktok_accounts", JSON.stringify(newAccounts));
                    localStorage.removeItem("tiktok_tokens"); // Cleanup
                    toast.success("Conta antiga migrada com sucesso!");
                } catch (e) {
                    console.error("Migration failed", e);
                }
            } else {
                setAccounts(storedAccounts);
                if (storedAccounts.length > 0) {
                    setSelectedAccountId(storedAccounts[0].id);
                }
            }
        };

        loadAccounts();
    }, [user, isLoading, navigate]);

    // Handle OAuth Callback (simulated check here or in a separate route)
    // For simplicity, we assume the user returns to /tiktok-callback which handles the code exchange
    // and saves to localStorage. ideally, that page should communicate back here.
    // For now, we rely on manual refresh or window focus to reload accounts if changed externally.

    const handleTikTokConnect = async () => {
        const clientKey = "sbawwmi043ldszzl4r";
        const redirectUri = encodeURIComponent("https://autotok.ggsolution.site/tiktok-callback");
        const scope = "user.info.basic,video.publish,video.upload";
        const state = "random123";
        const { generateCodeVerifier, generateCodeChallenge } = await import("@/lib/pkce");
        const codeVerifier = await generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        localStorage.setItem("tiktok_code_verifier", codeVerifier);
        window.location.href = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    };

    const removeAccount = (id: string) => {
        const newAccounts = accounts.filter(a => a.id !== id);
        setAccounts(newAccounts);
        localStorage.setItem("tiktok_accounts", JSON.stringify(newAccounts));
        if (selectedAccountId === id) {
            setSelectedAccountId(newAccounts[0]?.id || "");
        }
        toast.info("Conta removida.");
    };

    const processUpload = async () => {
        if (accounts.length === 0) {
            toast.error("Conecte ao TikTok primeiro!");
            setActiveTab('accounts');
            return;
        }

        const currentAccount = accounts.find(a => a.id === selectedAccountId);
        if (!currentAccount) {
            toast.error("Selecione uma conta válida!");
            return;
        }

        setIsUploading(true);
        try {
            let finalUrl = "";

            if (uploadMode === 'link') {
                const res = await fetch('/api/upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoUrl })
                });
                if (!res.ok) throw new Error("Erro ao baixar vídeo da URL");
                const data = await res.json();
                // Extract path from full URL to send to backend
                const urlObj = new URL(data.url);
                finalUrl = urlObj.pathname; // e.g., /upload/video-123.mp4
            } else {
                if (!selectedFile) {
                    toast.error("Selecione um arquivo!");
                    setIsUploading(false);
                    return;
                }
                const formData = new FormData();
                formData.append("video", selectedFile);
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error("Erro no upload do arquivo");
                const data = await res.json();
                // Extract path from full URL to send to backend
                const urlObj = new URL(data.url);
                finalUrl = urlObj.pathname; // e.g., /upload/video-123.mp4
            }

            console.log("Video ready at:", finalUrl);
            // For preview, use full URL. For TikTok, backend will construct full URL from path
            const fullPreviewUrl = finalUrl.startsWith('/') ? window.location.origin + finalUrl : finalUrl;
            setPreviewUrl(fullPreviewUrl);
            toast.success(`Enviando para @${currentAccount.nickname}...`);

            try {
                await initVideoUpload(currentAccount.accessToken, finalUrl);
                toast.success("Postagem iniciada/agendada!");
            } catch (error: any) {
                // Check if error is 401 or access_token_invalid
                const errorMsg = error.message || "";
                if (errorMsg.includes("401") || errorMsg.includes("access_token_invalid")) {
                    console.log("Token invalid. Attempting refresh...");
                    toast.info("Renovando conexão do TikTok...");

                    try {
                        const newTokens = await refreshTikTokToken(currentAccount.refreshToken);
                        console.log("Token refreshed successfully.");

                        // Update Account State & Storage
                        const updatedAccounts = accounts.map(acc => {
                            if (acc.id === currentAccount.id) {
                                return {
                                    ...acc,
                                    accessToken: newTokens.access_token,
                                    refreshToken: newTokens.refresh_token
                                };
                            }
                            return acc;
                        });

                        setAccounts(updatedAccounts);
                        localStorage.setItem("tiktok_accounts", JSON.stringify(updatedAccounts));

                        // Retry Upload with new token
                        await initVideoUpload(newTokens.access_token, finalUrl);
                        toast.success("Postagem iniciada após renovação!");

                    } catch (refreshError) {
                        console.error("Auto-refresh failed", refreshError);
                        toast.error("Sessão expirada. Por favor, reconecte a conta.");
                    }
                } else {
                    throw error; // Re-throw if not a token issue
                }
            }

        } catch (error: any) {
            console.error(error);
            toast.error("Falha no processo: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleGenerateScript = async () => {
        if (!prompt) return toast.error("Digite uma ideia para o vídeo");
        setIsGeneratingScript(true);
        try {
            const generated = await generateVideoScript(prompt);
            setScript(generated);
            toast.success("Roteiro Criado!");
        } catch (e) {
            toast.error("Erro na IA");
        } finally {
            setIsGeneratingScript(false);
        }
    };

    if (isLoading || !user) return <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center font-mono">Loading Studio...</div>;

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 gap-6 z-20">
                <div className="px-6 mb-4 hidden lg:block">
                    <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                        AUTOTOK
                    </h1>
                    <p className="text-xs text-white/40 tracking-widest uppercase mt-1">Studio Pro</p>
                </div>

                <nav className="w-full space-y-2 px-3">
                    <NavItem
                        icon={<Upload size={20} />}
                        label="Upload Studio"
                        active={activeTab === 'upload'}
                        onClick={() => setActiveTab('upload')}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Contas Conectadas"
                        active={activeTab === 'accounts'}
                        onClick={() => setActiveTab('accounts')}
                    />
                    <NavItem
                        icon={<Wand2 size={20} />}
                        label="AI Generator"
                        active={activeTab === 'ai'}
                        onClick={() => setActiveTab('ai')}
                    />
                    <div className="h-px bg-white/10 my-4 mx-3" />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={false}
                        onClick={() => { }}
                    />
                </nav>

                <div className="mt-auto px-3 w-full">
                    {accounts.length > 0 && (
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center lg:text-left">
                            <p className="text-xs text-green-400 font-bold">{accounts.length} Conta(s) Online</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden relative">
                {/* Background Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[150px] pointer-events-none" />

                {/* Center: Preview Stage */}
                <section className="flex-1 p-8 flex items-center justify-center relative bg-white/5 lg:bg-transparent">
                    <div className="relative w-[320px] h-[640px] bg-black rounded-[40px] border-8 border-gray-900 shadow-2xl overflow-hidden flex flex-col group">
                        {/* Phone Notion */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />

                        {/* Screen Content */}
                        <div className="flex-1 bg-gray-900 relative">
                            {previewUrl ? (
                                <video
                                    key={previewUrl}
                                    src={previewUrl}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    muted
                                    loop
                                    autoPlay
                                    controls={false}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-4">
                                    <Smartphone size={48} />
                                    <p className="text-sm">Preview Device</p>
                                </div>
                            )}

                            {/* TikTok UI Overlay Mockup */}
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-24 bg-white/20 rounded ml-2" />
                                        <div className="h-3 w-48 bg-white/10 rounded ml-2" />
                                    </div>
                                    <div className="flex flex-col gap-4 text-white/80">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><div className="w-5 h-5 bg-white rounded-full" /></div>
                                        <div className="w-10 h-10 rounded-full bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Controls */}
                <section className="w-full lg:w-[450px] border-l border-white/10 bg-black/40 backdrop-blur-md p-8 overflow-y-auto">

                    {/* ACCOUNTS TAB */}
                    {activeTab === 'accounts' && (
                        <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Contas Conectadas</h2>
                                <p className="text-white/40 text-sm">Gerencie quem pode postar vídeos</p>
                            </div>

                            <div className="space-y-3">
                                {accounts.map(acc => (
                                    <div key={acc.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                                {acc.avatar && <img src={acc.avatar} alt={acc.nickname} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{acc.nickname}</p>
                                                <p className="text-xs text-white/40">ID: {acc.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white" onClick={handleTikTokConnect}>
                                                <RefreshCw size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500/50 hover:text-red-500 hover:bg-red-500/10" onClick={() => removeAccount(acc.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    onClick={handleTikTokConnect}
                                    variant="outline"
                                    className="w-full border-dashed border-white/20 hover:bg-white/5 h-12 gap-2"
                                >
                                    <Plus size={16} /> Conectar Nova Conta
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* UPLOAD TAB */}
                    {activeTab === 'upload' && (
                        <div className="space-y-6 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Upload Studio</h2>
                                <p className="text-white/40 text-sm">Post content directly to TikTok</p>
                            </div>

                            {/* Account Selector */}
                            <div className="space-y-2">
                                <Label>Postar na conta:</Label>
                                {accounts.length > 0 ? (
                                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Selecione uma conta" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10 text-white">
                                            {accounts.map(acc => (
                                                <SelectItem key={acc.id} value={acc.id}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden inline-block align-middle">
                                                            {acc.avatar && <img src={acc.avatar} className="w-full h-full object-cover" />}
                                                        </span>
                                                        {acc.nickname}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Button variant="outline" className="w-full text-yellow-500 border-yellow-500/20" onClick={() => setActiveTab('accounts')}>
                                        Nenhuma conta conectada
                                    </Button>
                                )}
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="p-1 bg-white/5 rounded-xl flex gap-1">
                                <TabButton active={uploadMode === 'link'} onClick={() => setUploadMode('link')}>
                                    <LinkIcon size={16} className="mr-2" /> Link URL
                                </TabButton>
                                <TabButton active={uploadMode === 'file'} onClick={() => setUploadMode('file')}>
                                    <FileVideo size={16} className="mr-2" /> Arquivo Local
                                </TabButton>
                            </div>

                            <Card className="bg-white/5 border-white/10 text-white">
                                <CardContent className="pt-6 space-y-4">
                                    {uploadMode === 'link' ? (
                                        <div className="space-y-3">
                                            <Label>Link do Vídeo (MP4/Direct)</Label>
                                            <div className="relative">
                                                <Input
                                                    value={videoUrl}
                                                    onChange={(e) => {
                                                        setVideoUrl(e.target.value);
                                                        setPreviewUrl(e.target.value);
                                                    }}
                                                    className="bg-black/20 border-white/10 pl-10 focus:border-cyan-500 transition-colors"
                                                />
                                                <LinkIcon size={16} className="absolute left-3 top-3 text-white/30" />
                                            </div>
                                            <p className="text-xs text-white/30">O vídeo será baixado para o servidor e depois enviado.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label>Arquivo de Vídeo</Label>
                                            <div
                                                className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-white/5 hover:border-cyan-500/50 transition-all cursor-pointer group"
                                                onClick={() => document.getElementById('file-upload')?.click()}
                                            >
                                                <Upload size={32} className="text-white/30 group-hover:text-cyan-400 mb-4 transition-colors" />
                                                <p className="text-sm text-center text-white/60">
                                                    {selectedFile ? selectedFile.name : "Clique para selecionar ou arraste"}
                                                </p>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    accept="video/mp4,video/quicktime"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        setSelectedFile(file);
                                                        if (file) {
                                                            setPreviewUrl(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        onClick={processUpload}
                                        disabled={isUploading || accounts.length === 0}
                                        className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none shadow-lg shadow-cyan-900/20"
                                    >
                                        {isUploading ? "Processando..." : "🚀 Publicar no TikTok"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* AI TAB */}
                    {activeTab === 'ai' && (
                        <div className="space-y-8 animate-in slide-in-from-right-10 fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">AI Creator</h2>
                                <p className="text-white/40 text-sm">Generate viral scripts with Gemini</p>
                            </div>

                            <div className="space-y-4">
                                <Label>Sobre o que é o vídeo?</Label>
                                <Textarea
                                    className="bg-white/5 border-white/10 min-h-[150px] p-4 text-lg focus:border-fuchsia-500 transition-colors resize-none rounded-xl"
                                    placeholder="Ex: 5 Dicas para organizar o setup..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <Button
                                    onClick={handleGenerateScript}
                                    disabled={isGeneratingScript}
                                    className="w-full h-12 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500"
                                >
                                    {isGeneratingScript ? <Wand2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                                    Gerar Roteiro Mágico
                                </Button>
                            </div>

                            {script && (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono overflow-auto max-h-[400px]">
                                    <pre className="whitespace-pre-wrap text-white/70">{JSON.stringify(script, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

// UI Helpers
const NavItem = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center lg:justify-start justify-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-white text-black font-bold shadow-lg shadow-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
    >
        {icon}
        <span className="hidden lg:inline">{label}</span>
    </button>
);

const TabButton = ({ children, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white/10 text-white shadow' : 'text-white/40 hover:text-white'}`}
    >
        {children}
    </button>
);

export default Dashboard;
