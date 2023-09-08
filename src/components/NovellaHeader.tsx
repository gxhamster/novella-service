const NovellaHeader = () => (
  <nav className="fixed top-0 left-0 w-screen bg-surface-100 px-6 py-4 border-b-2 border-surface-200 flex justify-between">
    <div>Novella</div>
    <div className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="feather feather-user"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
  </nav>
);

export default NovellaHeader;
