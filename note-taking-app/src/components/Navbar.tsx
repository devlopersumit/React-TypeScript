interface NavbarProps {
  onOpenModal: () => void;
}

function Navbar({ onOpenModal }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 flex min-h-20 items-center justify-between bg-gradient-to-r from-slate-700 to-gray-800 px-6 text-white">
      <h1 className="text-2xl font-bold">Notes App</h1>

      <button
        onClick={onOpenModal}
        className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
      >
        Add New Note
      </button>
    </div>
  );
}

export default Navbar;