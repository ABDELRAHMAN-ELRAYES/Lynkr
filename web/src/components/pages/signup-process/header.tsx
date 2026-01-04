export default function Header() {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="w-full flex justify-start">
            <img
              src="/logo/no-violet.png"
              alt=""
              className="w-[10rem] h-[10rem] object-cover cursor-pointer duration-500 tranisition-all hover:-translate-y-2"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
