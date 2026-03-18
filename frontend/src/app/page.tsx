import Link from "next/link";

function CloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0A2.25 2.25 0 0 1 19.5 18h-15a2.25 2.25 0 0 1-2.25-2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 18.91a2.25 2.25 0 0 1-1.07-1.916V15.75" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

export default function Home() {
  const features = [
    { icon: <CloudIcon />, color: "bg-blue-50 text-blue-600", title: "5 GB Free Storage", desc: "Secure cloud storage for every account. Upload files up to 500 MB, always accessible." },
    { icon: <LinkIcon />, color: "bg-violet-50 text-violet-600", title: "Shareable Links", desc: "Generate public links with optional expiry dates. Revoke access instantly any time." },
    { icon: <FolderIcon />, color: "bg-amber-50 text-amber-600", title: "Folder Organiser", desc: "Keep files tidy with nested folder support and direct drag-and-drop upload." },
    { icon: <ShieldIcon />, color: "bg-emerald-50 text-emerald-600", title: "Secure by Default", desc: "JWT-based auth, per-user isolation, and HTTPS-only access protect your data." },
  ];
  const steps = [
    { num: "01", title: "Create an account", desc: "Sign up free in under 30 seconds. No credit card needed." },
    { num: "02", title: "Upload your files", desc: "Drag & drop or click to select. Organise with folders." },
    { num: "03", title: "Share the link", desc: "Generate a share link and send it to anyone, anywhere." },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
      {/* Sticky nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
            </div>
            <span className="text-xl font-bold text-gray-900">FileShare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">Sign In</Link>
            <Link href="/register" className="btn-primary">Get started free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 pt-20 pb-28">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-100/30 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center card shadow-xl">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            Free to use · No credit card required
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight section-header">
            Store, share &amp; manage<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">files effortlessly</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed section-sub">
            Upload files, organise them into folders, and share secure links with anyone — all from your browser. 5 GB free for every account.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="bg-primary-600 text-white px-8 py-3.5 rounded-2xl text-base font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-[0.98]">Start for free →</Link>
            <Link href="/login" className="bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-gray-50 transition-all shadow-sm">Sign in</Link>
          </div>
        </div>
        {/* Browser mockup */}
        <div className="relative max-w-3xl mx-auto mt-16 px-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full" /><div className="w-3 h-3 bg-yellow-400 rounded-full" /><div className="w-3 h-3 bg-green-400 rounded-full" /></div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-400 border border-gray-100 text-center max-w-[220px] mx-auto">fileshare.app/dashboard</div>
            </div>
            <div className="p-5 flex gap-4">
              <div className="w-36 shrink-0 space-y-1">
                <div className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-2 rounded-xl">🏠 My Files</div>
                {["Projects", "Photos", "Documents"].map(n => (
                  <div key={n} className="text-gray-500 text-xs px-3 py-2 rounded-xl hover:bg-gray-50">📁 {n}</div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {[{n:"report.pdf",e:"PDF",c:"bg-red-100 text-red-600"},{n:"design.fig",e:"FIG",c:"bg-purple-100 text-purple-600"},{n:"notes.txt",e:"TXT",c:"bg-slate-100 text-slate-600"},{n:"photo.jpg",e:"JPG",c:"bg-purple-100 text-purple-600"},{n:"data.xlsx",e:"XLS",c:"bg-emerald-100 text-emerald-600"},{n:"README.md",e:"MD",c:"bg-slate-100 text-slate-600"}].map((f) => (
                  <div key={f.n} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className={`w-8 h-8 ${f.c} rounded-lg mb-2 flex items-center justify-center text-[9px] font-bold`}>{f.e}</div>
                    <p className="text-xs text-gray-700 font-medium truncate">{f.n}</p>
                    <p className="text-[10px] text-gray-400">2 MB</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary-600 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{v:"5 GB",l:"Free storage"},{v:"500 MB",l:"Max file size"},{v:"∞",l:"Shareable links"},{v:"100%",l:"Open source"}].map(s => (
            <div key={s.l}>
              <div className="text-3xl font-extrabold text-white">{s.v}</div>
              <div className="text-primary-200 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center bg-gradient-to-br from-primary-50 to-white">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Share files <span className="text-primary-600">securely</span>, instantly
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">
          Upload, organise and share files with anyone. Generate shareable links with optional
          expiry. 5 GB free storage for every account.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="border border-primary-600 text-primary-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to share files</h2>
            <p className="text-gray-500 text-lg">No bloat. Just the features that matter.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all group">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Up and running in minutes</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">{step.num}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-600 to-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to get started?</h2>
          <p className="text-primary-200 text-lg mb-8">Create your free account and start sharing files today.</p>
          <Link href="/register" className="inline-block bg-white text-primary-700 px-10 py-4 rounded-2xl text-base font-bold hover:bg-primary-50 transition-all shadow-lg active:scale-[0.98]">
            Create free account →
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
          </div>
          <span className="text-white font-bold text-sm">FileShare</span>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} FileShare. All rights reserved.</p>
      </footer>
    </main>
  );
}
