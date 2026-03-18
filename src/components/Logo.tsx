import { Link } from "react-router-dom"
import { Play } from "lucide-react"

type Props = {
    size?: "sm" | "md" | "lg"
}

export default function Logo({ size = "md" }: Props) {
    const sizes = {
        sm: {
            box: "w-6 h-6",
            icon: 14,
            text: "text-base",
            gap: "gap-2",
        },
        md: {
            box: "w-8 h-8",
            icon: 18,
            text: "text-xl",
            gap: "gap-2.5",
        },
        lg: {
            box: "w-14 h-14",
            icon: 28,
            text: "text-4xl md:text-5xl",
            gap: "gap-4",
        },
    }

    const s = sizes[size]

    return (
        <Link
            to="/"
            className={`flex items-center ${s.gap} group select-none`}
        >
            {/* Icon */}
            <div
                className={`
                ${s.box}
                rounded-xl
                flex items-center justify-center
                shadow-lg
                transition
                group-hover:scale-110
                bg-gradient-to-r
                from-[var(--accent-orange)]
                to-[var(--accent-purple)]
            `}
            >
                <Play size={s.icon} className="text-white fill-white" />
            </div>

            {/* Text */}
            <span
                className={`
                font-black tracking-tight
                ${s.text}
                transition-all
                group-hover:tracking-wide
            `}
            >
                ve
                <span
                    className="
                    text-transparent
                    bg-gradient-to-r
                    from-[var(--accent-orange)]
                    to-[var(--accent-purple)]
                    bg-clip-text
                "
                >
                    comigo
                </span>
            </span>
        </Link>
    )
}