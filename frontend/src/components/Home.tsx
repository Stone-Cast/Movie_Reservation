import {
    useEffect,
    useState,
    useRef,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { Link } from "wouter";
import { useUserContext } from "../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Movie {
    movie_id: string;
    title: string;
    description: string;
    duration_minutes: number;
    release_date: string;
    poster_url?: string;
}

interface Schedule {
    id: string;
    screen_id: string;
    start_time: string;
    end_time: string;
}

interface MovieForm {
    title: string;
    description: string;
    duration_minutes: string;
    release_date: string;
}

interface Genre {
    genre_id: number;
    name: string;
}

interface Screen {
    screen_id: number;
    screen_number: number;
    screen_name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseLocal(val: string): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

function toLocalInput(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function todayISO(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ─── Shared classes ───────────────────────────────────────────────────────────

const inputCls =
    "w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 py-[0.75rem] text-sm font-light text-[#f0ede6] placeholder:text-white/15 outline-none transition-all duration-200 focus:border-white/30 focus:bg-white/[0.07] focus:ring-2 focus:ring-white/[0.04]";
const labelCls =
    "mb-2 block text-[0.62rem] font-medium uppercase tracking-[0.15em] text-white/35";

// ─── Movie Card ───────────────────────────────────────────────────────────────

const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
    const releaseYear = new Date(movie.release_date).getFullYear();
    const hours = Math.floor(movie.duration_minutes / 60);
    const mins = movie.duration_minutes % 60;
    const duration = `${hours}h ${mins}m`;

    return (
        <Link href={`/reserve?movie=${movie.movie_id}`}>
            <article
                className="group relative flex flex-col overflow-hidden rounded-sm border border-white/[0.07] bg-white/[0.02] transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] cursor-pointer"
                style={{ animationDelay: `${index * 0.07}s` }}
            >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/[0.03]">
                    {movie.poster_url ? (
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                            >
                                <rect
                                    x="1"
                                    y="1"
                                    width="30"
                                    height="30"
                                    rx="2"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1.5"
                                />
                                <rect
                                    x="3"
                                    y="3"
                                    width="5"
                                    height="5"
                                    rx="0.5"
                                    fill="rgba(255,255,255,0.08)"
                                />
                                <rect
                                    x="24"
                                    y="3"
                                    width="5"
                                    height="5"
                                    rx="0.5"
                                    fill="rgba(255,255,255,0.08)"
                                />
                                <rect
                                    x="3"
                                    y="24"
                                    width="5"
                                    height="5"
                                    rx="0.5"
                                    fill="rgba(255,255,255,0.08)"
                                />
                                <rect
                                    x="24"
                                    y="24"
                                    width="5"
                                    height="5"
                                    rx="0.5"
                                    fill="rgba(255,255,255,0.08)"
                                />
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="5"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="1.5"
                                />
                            </svg>
                            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/15">
                                No poster
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                            >
                                <path
                                    d="M2 1L10 6L2 11V1Z"
                                    fill="currentColor"
                                />
                            </svg>
                            Reserve
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-2 py-1 text-[0.6rem] font-medium tracking-wide text-white/60 backdrop-blur-sm">
                        {duration}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif-display text-base font-normal leading-tight text-[#f0ede6] transition-colors duration-200 group-hover:text-white">
                            {movie.title}
                        </h3>
                        <span className="mt-0.5 shrink-0 text-[0.6rem] tracking-wide text-white/25">
                            {releaseYear}
                        </span>
                    </div>
                    {movie.description && (
                        <p className="line-clamp-2 text-[0.72rem] font-light leading-relaxed text-white/35">
                            {movie.description}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="flex flex-col overflow-hidden rounded-sm border border-white/[0.05] bg-white/[0.02]">
        <div className="skeleton aspect-[2/3] w-full" />
        <div className="flex flex-col gap-3 p-4">
            <div className="skeleton h-4 w-3/4 rounded-sm" />
            <div className="skeleton h-3 w-full rounded-sm" />
            <div className="skeleton h-3 w-2/3 rounded-sm" />
        </div>
    </div>
);

// ─── Genre Picker ─────────────────────────────────────────────────────────────

const GenrePicker = ({
    allGenres,
    selected,
    onChange,
}: {
    allGenres: Genre[];
    selected: Genre[];
    onChange: (genres: Genre[]) => void;
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    function toggle(genre: Genre) {
        if (selected.find((g) => g.genre_id === genre.genre_id)) {
            onChange(selected.filter((g) => g.genre_id !== genre.genre_id));
        } else {
            onChange([...selected, genre]);
        }
    }

    function remove(id: number) {
        onChange(selected.filter((g) => g.genre_id !== id));
    }

    const available = allGenres.filter(
        (g) => !selected.find((s) => s.genre_id === g.genre_id)
    );

    return (
        <div ref={ref} className="relative">
            {/* Selected tags + trigger */}
            <div
                onClick={() => setOpen((v) => !v)}
                className="flex min-h-[3rem] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2 transition-all duration-200 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/[0.07]"
            >
                {selected.length === 0 && (
                    <span className="text-sm font-light text-white/15 select-none px-1">
                        Select genres…
                    </span>
                )}
                {selected.map((g) => (
                    <span
                        key={g.genre_id}
                        className="flex items-center gap-1 rounded-sm border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-white/60"
                    >
                        {g.name}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                remove(g.genre_id);
                            }}
                            className="ml-0.5 text-white/30 transition-colors hover:text-white/70"
                            aria-label={`Remove ${g.name}`}
                        >
                            <svg
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                            >
                                <path
                                    d="M1 1L7 7M7 1L1 7"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </span>
                ))}
                {/* chevron */}
                <span
                    className="ml-auto shrink-0 text-white/20 transition-transform duration-200"
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M2 3.5L5 6.5L8 3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-44 overflow-y-auto rounded-sm border border-white/10 bg-[#131316] shadow-xl no-scrollbar">
                    {available.length === 0 ? (
                        <p className="px-4 py-3 text-[0.7rem] text-white/25">
                            All genres selected
                        </p>
                    ) : (
                        available.map((g) => (
                            <button
                                key={g.genre_id}
                                type="button"
                                onClick={() => {
                                    toggle(g);
                                }}
                                className="w-full px-4 py-2.5 text-left text-[0.75rem] font-light text-white/50 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white/80"
                            >
                                {g.name}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Add Movie Drawer ─────────────────────────────────────────────────────────

const AddMovieDrawer = ({
    open,
    onClose,
    onSuccess,
    theaterScreens,
    allGenres,
}: {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    theaterScreens: Screen[];
    allGenres: Genre[];
}) => {
    const [form, setForm] = useState<MovieForm>({
        title: "",
        description: "",
        duration_minutes: "",
        release_date: "",
    });
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: crypto.randomUUID(),
            screen_id: "",
            start_time: "",
            end_time: "",
        },
    ]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // ── Form field changes ─────────────────────────────────────────────────────
    function handleFormChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        if (name === "duration_minutes") {
            const mins = parseInt(value, 10);
            setForm((p) => ({ ...p, duration_minutes: value }));
            if (!isNaN(mins) && mins > 0) {
                setSchedules((prev) =>
                    prev.map((s) => {
                        const start = parseLocal(s.start_time);
                        if (!start) return s;
                        return {
                            ...s,
                            end_time: toLocalInput(
                                new Date(start.getTime() + mins * 60000)
                            ),
                        };
                    })
                );
            }
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
        if (error) setError("");
    }

    // ── Schedule field changes ─────────────────────────────────────────────────
    function handleScheduleChange(
        id: string,
        field: keyof Omit<Schedule, "id">,
        value: string
    ) {
        setSchedules((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                const updated = { ...s, [field]: value };
                const durationMins = parseInt(form.duration_minutes, 10);

                if (field === "start_time") {
                    const start = parseLocal(value);
                    if (start && !isNaN(durationMins) && durationMins > 0) {
                        updated.end_time = toLocalInput(
                            new Date(start.getTime() + durationMins * 60000)
                        );
                    }
                }
                if (field === "end_time") {
                    const start = parseLocal(s.start_time);
                    const end = parseLocal(value);
                    if (start && end && end > start) {
                        const diffMins = Math.round(
                            (end.getTime() - start.getTime()) / 60000
                        );
                        setForm((p) => ({
                            ...p,
                            duration_minutes: String(diffMins),
                        }));
                    }
                }
                return updated;
            })
        );
        if (error) setError("");
    }

    function addSchedule() {
        setSchedules((p) => [
            ...p,
            {
                id: crypto.randomUUID(),
                screen_id: "",
                start_time: "",
                end_time: "",
            },
        ]);
    }

    function removeSchedule(id: string) {
        if (schedules.length === 1) return;
        setSchedules((p) => p.filter((s) => s.id !== id));
    }

    function reset() {
        setForm({
            title: "",
            description: "",
            duration_minutes: "",
            release_date: "",
        });
        setSchedules([
            {
                id: crypto.randomUUID(),
                screen_id: "",
                start_time: "",
                end_time: "",
            },
        ]);
        setSelectedGenres([]);
        setError("");
        setSuccess(false);
    }

    function handleClose() {
        reset();
        onClose();
    }

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!form.title.trim()) {
            setError("Movie title is required.");
            return;
        }
        if (selectedGenres.length === 0) {
            setError("Please select at least one genre.");
            return;
        }
        for (const s of schedules) {
            if (!s.screen_id || !s.start_time || !s.end_time) {
                setError("Please fill in all schedule fields.");
                return;
            }
            if (new Date(s.end_time) <= new Date(s.start_time)) {
                setError(
                    "End time must be after start time for all schedules."
                );
                return;
            }
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/admin/movies/add`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...form,
                        title: form.title.trim(),
                        duration_minutes: Number(form.duration_minutes),
                        genre_ids: selectedGenres.map((g) => g.genre_id),
                        schedules: schedules.map(
                            ({ screen_id, start_time, end_time }) => ({
                                screen_id: Number(screen_id),
                                start_time,
                                end_time,
                            })
                        ),
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setSuccess(true);
            onSuccess();
            setTimeout(() => {
                handleClose();
            }, 1800);
        } catch (err) {
            const e = err as Error;
            setError(e.message || "Failed to add movie.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={handleClose}
            />

            {/* Drawer — no internal scroll, full height flex column */}
            <aside
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-white/[0.08] bg-[#0e0e10] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Fixed header */}
                <div className="relative shrink-0 flex items-center justify-between border-b border-white/[0.06] px-8 py-6">
                    <div>
                        <p className="mb-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/25">
                            Admin
                        </p>
                        <h2 className="font-serif-display text-2xl font-normal text-[#f0ede6]">
                            Add <em className="text-[#f0ede6]/45">new</em> movie
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-white/30 transition-all duration-200 hover:border-white/25 hover:text-white/70"
                        aria-label="Close"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                        >
                            <path
                                d="M1 1L11 11M11 1L1 11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Scrollable body — scrollbar hidden */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-7">
                    {success ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-white/15 bg-white/[0.04]">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M4 10L8.5 14.5L16 6"
                                        stroke="rgba(240,237,230,0.8)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm tracking-wide text-white/50">
                                Movie added successfully.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="flex flex-col gap-5 pb-4"
                        >
                            {/* ── Movie details ── */}
                            <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/20">
                                Movie details
                            </p>

                            <div>
                                <label className={labelCls}>Title</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    placeholder="e.g. Dune: Part Three"
                                    required
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange as any}
                                    placeholder="Brief synopsis…"
                                    rows={3}
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>
                                        Duration (mins)
                                        {form.duration_minutes &&
                                            !isNaN(
                                                parseInt(form.duration_minutes)
                                            ) && (
                                                <span className="ml-2 normal-case tracking-normal text-white/20">
                                                    —{" "}
                                                    {Math.floor(
                                                        parseInt(
                                                            form.duration_minutes
                                                        ) / 60
                                                    )}
                                                    h{" "}
                                                    {parseInt(
                                                        form.duration_minutes
                                                    ) % 60}
                                                    m
                                                </span>
                                            )}
                                    </label>
                                    <input
                                        name="duration_minutes"
                                        type="number"
                                        min="1"
                                        max="600"
                                        value={form.duration_minutes}
                                        onChange={handleFormChange}
                                        placeholder="120"
                                        required
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>
                                        Release date
                                    </label>
                                    <input
                                        name="release_date"
                                        type="date"
                                        min={todayISO()}
                                        value={form.release_date}
                                        onChange={handleFormChange}
                                        required
                                        className={`${inputCls} [color-scheme:dark]`}
                                    />
                                </div>
                            </div>

                            {/* ── Genres ── */}
                            <div>
                                <label className={labelCls}>Genres</label>
                                <GenrePicker
                                    allGenres={allGenres}
                                    selected={selectedGenres}
                                    onChange={setSelectedGenres}
                                />
                            </div>

                            {/* ── Showtimes ── */}
                            <div className="mt-2 border-t border-white/[0.06] pt-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/20">
                                        Showtimes
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addSchedule}
                                        className="flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-white/35 transition-all duration-200 hover:border-white/25 hover:text-white/65"
                                    >
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                        >
                                            <path
                                                d="M5 1V9M1 5H9"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        Add slot
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {schedules.map((s, i) => (
                                        <div
                                            key={s.id}
                                            className="rounded-sm border border-white/[0.07] bg-white/[0.02] p-4"
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-white/20">
                                                    Slot {i + 1}
                                                </span>
                                                {schedules.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSchedule(s.id)
                                                        }
                                                        className="text-[0.6rem] uppercase tracking-wide text-white/20 transition-colors hover:text-red-400/70"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label className={labelCls}>
                                                    Screen
                                                </label>
                                                <select
                                                    value={s.screen_id}
                                                    onChange={(e) =>
                                                        handleScheduleChange(
                                                            s.id,
                                                            "screen_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`${inputCls} appearance-none`}
                                                    required
                                                >
                                                    <option value="" disabled>
                                                        Select screen…
                                                    </option>
                                                    {theaterScreens.map(
                                                        (sc) => (
                                                            <option
                                                                key={
                                                                    sc.screen_id
                                                                }
                                                                value={
                                                                    sc.screen_id
                                                                }
                                                            >
                                                                Screen{" "}
                                                                {
                                                                    sc.screen_number
                                                                }{" "}
                                                                (
                                                                {sc.screen_name}
                                                                )
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className={labelCls}>
                                                        Start time
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={s.start_time}
                                                        onChange={(e) =>
                                                            handleScheduleChange(
                                                                s.id,
                                                                "start_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`${inputCls} [color-scheme:dark]`}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>
                                                        End time
                                                        {s.start_time &&
                                                            s.end_time &&
                                                            (() => {
                                                                const st =
                                                                    parseLocal(
                                                                        s.start_time
                                                                    );
                                                                const et =
                                                                    parseLocal(
                                                                        s.end_time
                                                                    );
                                                                if (
                                                                    st &&
                                                                    et &&
                                                                    et > st
                                                                ) {
                                                                    return (
                                                                        <span className="ml-1 normal-case tracking-normal text-white/20">
                                                                            —{" "}
                                                                            {Math.round(
                                                                                (et.getTime() -
                                                                                    st.getTime()) /
                                                                                    60000
                                                                            )}
                                                                            m
                                                                        </span>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={s.end_time}
                                                        onChange={(e) =>
                                                            handleScheduleChange(
                                                                s.id,
                                                                "end_time",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`${inputCls} [color-scheme:dark]`}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-center gap-2 rounded-sm border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-[0.72rem] tracking-wide text-red-300/90"
                                >
                                    <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-red-400/80" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-1 w-full rounded-sm bg-[#f0ede6] py-[0.9rem] text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#0c0c0e] transition-all duration-200 hover:enabled:bg-white hover:enabled:shadow-[0_0_24px_rgba(240,237,230,0.12)] active:enabled:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isLoading && (
                                        <span className="h-3 w-3 rounded-full border border-[#0c0c0e]/30 border-t-[#0c0c0e] animate-spin-fast" />
                                    )}
                                    {isLoading ? "Adding movie…" : "Add movie"}
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </aside>
        </>
    );
};

// ─── Home ─────────────────────────────────────────────────────────────────────

const Home = () => {
    const { userData } = useUserContext();
    const [movies, setMovies] = useState<Movie[] | undefined>(undefined);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [theaterScreens, setTheaterScreens] = useState<Screen[]>([]);
    const [allGenres, setAllGenres] = useState<Genre[]>([]);

    const isAdmin = userData?.user.rol === 0;

    function fetchMovies() {
        setLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/movies`)
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch(() => setError("Failed to load movies. Please try again."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        // fetch genres
        fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/genres`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setAllGenres(data))
            .catch(() => console.error("Failed to load genres"));

        // fetch screens for this admin's theater
        if (!userData?.user.theater) return;
        fetch(
            `${import.meta.env.VITE_BACKEND_URL}/admin/${
                userData.user.theater
            }/screens`,
            { credentials: "include" }
        )
            .then((res) => res.json())
            .then((data) => setTheaterScreens(data))
            .catch(() => console.error("Failed to load screens"));
    }, [isAdmin, userData?.user.theater]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
                .font-serif-display { font-family: 'DM Serif Display', serif; }
                .font-mono-dm       { font-family: 'DM Mono', monospace; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    from { background-position: -200% 0; }
                    to   { background-position: 200% 0; }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .animate-spin-fast { animation: spin 0.6s linear infinite; }
                .cards-grid article { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
                .skeleton {
                    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.6s ease-in-out infinite;
                }
                .bg-page {
                    background-color: #0c0c0e;
                    background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
                }
                select option { background: #1a1a1e; color: #f0ede6; }
                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            <div className="font-mono-dm bg-page min-h-screen px-6 py-12 md:px-12 lg:px-20">
                <header className="animate-fade-up mb-12 flex items-end justify-between">
                    <div>
                        <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/25">
                            Now showing
                        </p>
                        <h1 className="font-serif-display text-4xl font-normal tracking-tight text-[#f0ede6] md:text-5xl">
                            What's <em className="text-[#f0ede6]/40">on</em>{" "}
                            today
                        </h1>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-white/50 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.06] hover:text-white/80"
                        >
                            <svg
                                width="11"
                                height="11"
                                viewBox="0 0 11 11"
                                fill="none"
                            >
                                <path
                                    d="M5.5 1V10M1 5.5H10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Add movie
                        </button>
                    )}
                </header>

                {error && (
                    <div className="mb-8 flex items-center gap-2 rounded-sm border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-[0.75rem] tracking-wide text-red-300/90">
                        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-red-400/80" />
                        {error}
                    </div>
                )}

                <div className="cards-grid grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => (
                              <SkeletonCard key={i} />
                          ))
                        : movies?.map((movie, i) => (
                              <MovieCard
                                  key={movie.movie_id}
                                  movie={movie}
                                  index={i}
                              />
                          ))}
                </div>

                {!loading && !error && movies?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 32 32"
                            fill="none"
                            className="mb-4 opacity-20"
                        >
                            <rect
                                x="1"
                                y="1"
                                width="30"
                                height="30"
                                rx="2"
                                stroke="white"
                                strokeWidth="1.5"
                            />
                            <rect
                                x="3"
                                y="3"
                                width="5"
                                height="5"
                                rx="0.5"
                                fill="white"
                            />
                            <rect
                                x="24"
                                y="3"
                                width="5"
                                height="5"
                                rx="0.5"
                                fill="white"
                            />
                            <rect
                                x="3"
                                y="24"
                                width="5"
                                height="5"
                                rx="0.5"
                                fill="white"
                            />
                            <rect
                                x="24"
                                y="24"
                                width="5"
                                height="5"
                                rx="0.5"
                                fill="white"
                            />
                        </svg>
                        <p className="text-sm tracking-wide text-white/20">
                            No movies scheduled yet.
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="mt-4 text-[0.7rem] tracking-wide text-white/30 underline underline-offset-4 transition-colors hover:text-white/60"
                            >
                                Add the first one
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isAdmin && (
                <AddMovieDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onSuccess={fetchMovies}
                    theaterScreens={theaterScreens}
                    allGenres={allGenres}
                />
            )}
        </>
    );
};

export default Home;
