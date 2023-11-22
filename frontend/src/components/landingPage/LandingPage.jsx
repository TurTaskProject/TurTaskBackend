export function LandingPage() {
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">TurTask</a>
        </div>
        <div className="navbar-end space-x-3 pr-2">
          <a className="btn" href="/login">
            Login
          </a>
          <a className="btn" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
      <div className="relative" id="home">
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="relative pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-900 font-bold text-5xl md:text-6xl xl:text-7xl">
                Manage your task with{" "}
                <span className="text-primary">
                  TurTask
                  <label className="swap swap-flip text-6xl">
                    <input type="checkbox" />
                    <div className="swap-on">😇</div>
                    <div className="swap-off">🥳</div>
                  </label>
                </span>
              </h1>
              <p className="mt-8 text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio incidunt nam itaque sed eius modi error
                totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem harum omnis beatae ipsum soluta!
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                <a
                  href="/login"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max">
                  <span className="relative text-base font-semibold text-white">Get started</span>
                </a>
                <a
                  href="#"
                  className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max">
                  <span className="relative text-base font-semibold text-primary">Placeholder</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
