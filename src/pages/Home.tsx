import { useRoom } from "@hooks/useRoom";
import logo from "@assets/logo.png";

import { Play, Users, ListVideo, Link2, Sparkles } from "lucide-react";

export default function Home() {
    const { createRoom } = useRoom(undefined);

    return (
        <div className="bg-[var(--bg-base)] text-white">
            {/* HERO */}

            <section className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden bg-animated">
                {/* glow central */}
                <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[160px] rounded-full" />

                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="relative">
                        <img src={logo} className="w-40 select-none" />

                        <div className="absolute inset-0 bg-purple-500/20 blur-[120px] rounded-full -z-10" />
                    </div>

                    <div className="text-center space-y-3">
                        <h1 className="text-5xl font-black tracking-tight leading-tight">
                            Assista vídeos
                            <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                                junto
                            </span>
                        </h1>

                        <p className="text-zinc-400 max-w-md">
                            Crie salas privadas e assista vídeos com seus amigos
                            em perfeita sincronia.
                        </p>
                    </div>

                    <button
                        onClick={createRoom}
                        className="
px-10 py-4
rounded-xl
font-semibold
bg-gradient-to-r
from-orange-400
via-purple-500
to-blue-500
hover:scale-105
transition
shadow-lg
hover:shadow-purple-500/30
flex items-center gap-2
"
                    >
                        <Play size={18} />
                        Criar sala
                    </button>
                </div>
            </section>

            {/* FEATURES */}

            <section className="py-28 max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16">
                    Assista com quem você quiser
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* card */}

                    <div
                        className="
bg-[var(--bg-card)]
p-8
rounded-2xl
border border-[var(--border-default)]
hover:border-purple-500/40
hover:-translate-y-2
transition-all
duration-300
"
                    >
                        <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <Play className="text-purple-400" size={22} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Assista junto
                        </h3>

                        <p className="text-zinc-400 text-sm">
                            Sincronização automática do vídeo para todos na
                            sala.
                        </p>
                    </div>

                    {/* card */}

                    <div
                        className="
bg-[var(--bg-card)]
p-8
rounded-2xl
border border-[var(--border-default)]
hover:border-orange-500/40
hover:-translate-y-2
transition-all
duration-300
"
                    >
                        <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <Users className="text-orange-400" size={22} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Com amigos
                        </h3>

                        <p className="text-zinc-400 text-sm">
                            Convide qualquer pessoa com um link simples.
                        </p>
                    </div>

                    {/* card */}

                    <div
                        className="
bg-[var(--bg-card)]
p-8
rounded-2xl
border border-[var(--border-default)]
hover:border-blue-500/40
hover:-translate-y-2
transition-all
duration-300
"
                    >
                        <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <ListVideo className="text-blue-400" size={22} />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">
                            Playlist compartilhada
                        </h3>

                        <p className="text-zinc-400 text-sm">
                            Monte playlists colaborativas na mesma sala.
                        </p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}

            <section className="py-28 bg-[var(--bg-surface)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">
                        Como funciona
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-purple-500/10 p-4 rounded-xl">
                                <Sparkles className="text-purple-400" />
                            </div>

                            <p className="text-zinc-400">Crie uma sala</p>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-orange-500/10 p-4 rounded-xl">
                                <Link2 className="text-orange-400" />
                            </div>

                            <p className="text-zinc-400">
                                Envie o link para seus amigos
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-blue-500/10 p-4 rounded-xl">
                                <Users className="text-blue-400" />
                            </div>

                            <p className="text-zinc-400">
                                Assistam sincronizados
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}

            <section className="py-32 text-center relative overflow-hidden">
                <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-0" />

                <div className="relative z-10 max-w-xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4 leading-tight">
                        Pronto para assistir <br />
                        <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                            junto com seus amigos?
                        </span>
                    </h2>

                    <p className="text-zinc-400 mb-8">
                        Crie uma sala em segundos, compartilhe o link e
                        aproveite vídeos sincronizados com quem você quiser.
                    </p>

                    <button
                        onClick={createRoom}
                        className="
px-12 py-5
rounded-xl
font-semibold
bg-gradient-to-r
from-orange-400
via-purple-500
to-blue-500
hover:scale-105
transition
shadow-xl
hover:shadow-purple-500/40
"
                    >
                        Criar minha sala
                    </button>
                </div>
            </section>

            {/* FOOTER */}

            <footer className="border-t border-zinc-900 py-10 text-center text-zinc-500 text-sm">
                <p className="mb-2">
                    Feito por{" "}
                    <span className="text-white font-medium">piedro404</span>
                </p>

                <a
                    href="https://github.com/piedro404"
                    target="_blank"
                    className="text-purple-400 hover:underline"
                >
                    github.com/piedro404
                </a>
            </footer>
        </div>
    );
}
