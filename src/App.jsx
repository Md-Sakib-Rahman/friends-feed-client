import './App.css'

function App() {
  return (
    <div className="min-h-screen p-8 space-y-12">
      {/* 1. Typography & Hero Section */}
      <section className="space-y-4">
        <h1 className="text-5xl font-extrabold text-primary">Evergreen Theme Check</h1>
        <p className="text-xl text-base-content/70">
          Testing Emerald-600 to Teal-600 gradients and DaisyUI components.
        </p>
      </section>

      <hr className="border-base-300" />

      {/* 2. Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons (Custom Gradients)</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary Gradient</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
          <button className="btn btn-outline">Outline Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-link">Link Button</button>
        </div>
      </section>

      {/* 3. Cards & Surfaces */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards & Base Surfaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-primary">Base 100 Card</h2>
              <p>This is the main background surface (White/Dark Slate).</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h2 className="card-title text-secondary">Base 200 Card</h2>
              <p>Used for sidebars or secondary containers.</p>
            </div>
          </div>
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Primary Surface</h2>
              <p>Solid primary color background with high contrast text.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Form Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Form Elements</h2>
        <div className="flex flex-col max-w-sm gap-4">
          <input type="text" placeholder="Type here..." className="input input-bordered w-full" />
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="checkbox checkbox-primary" />
            <span>Checkbox test</span>
          </div>
          <input type="range" min="0" max="100" className="range range-primary" />
        </div>
      </section>

      {/* 5. Feedback & Alerts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Status Alerts</h2>
        <div className="alert alert-success shadow-lg">
          <span>Success: Database connected to Upstash!</span>
        </div>
        <div className="alert alert-error shadow-lg">
          <span>Error: Socket connection failed.</span>
        </div>
      </section>
      {/* 6. Advanced Effects: Glassmorphism & Ambient Gradients */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Ambient Glassmorphism Effects</h2>
        
        {/* Container with Ambient Background Blurs */}
        <div className="relative p-12 overflow-hidden rounded-3xl bg-base-300/30 border border-base-300">
          
          {/* Ambient Gradient Orbs (Background) */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Glass Card 1: The Frost Effect */}
            <div className="p-8 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">G</div>
                <h3 className="text-xl font-bold">Frosted Glass</h3>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                Using <code>backdrop-blur-xl</code> and semi-transparent backgrounds to create a premium frosted effect that adapts to light/dark themes.
              </p>
              <button className="btn btn-sm btn-primary mt-6">Action</button>
            </div>

            {/* Glass Card 2: Interactive Ambient */}
            <div className="p-8 rounded-2xl bg-primary/5 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all group">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Ambient Border</h3>
              <p className="text-sm opacity-80">
                This card uses a subtle primary tint in its glass effect. Hover to see the border "glow" intensify.
              </p>
              <div className="mt-6 flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-base-100 bg-base-300 flex items-center justify-center text-xs font-bold">U{i}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default App