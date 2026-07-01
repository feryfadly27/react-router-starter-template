export function Welcome({ message }: { message: string }) {
	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 px-6 py-16">
			<section className="w-full max-w-3xl rounded-3xl border border-white/70 bg-white/75 p-8 text-center shadow-xl backdrop-blur-md md:p-12">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
					Kuisoner Penelitian
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
					Selamat Datang di Kuisoner Penelitian
				</h1>
				<p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
					{message}
				</p>
			</section>
		</main>
	);
}
