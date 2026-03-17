type Props = {
    createRoom: () => void
}

export default function CTA({ createRoom }: Props) {
    return (
        <section className="py-32 text-center relative overflow-hidden">

            <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[160px] rounded-full left-1/2 -translate-x-1/2 top-0"/>

            <div className="relative z-10 max-w-xl mx-auto">

                <h2 className="text-4xl font-bold mb-4 leading-tight">

                    Pronto para assistir <br/>

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
    )
}