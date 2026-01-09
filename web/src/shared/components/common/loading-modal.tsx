import { LoaderCircle } from "lucide-react";

export const LoadingModal = () => {
  return (
    <div className="flex w-full h-full">
      <div className="fixed top-0 l-0 w-full h-full bg-white z-[10000]">
        <div className="flex justify-center items-center flex-col gap-4 h-screen bg-white">
          <div className="flex-shrink-0">
            <img
              src="/logo/no-violet-cut.png"
              alt="logo"
              className="w-[10rem] h-24"
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <LoaderCircle size={24} className="animate-spin text-[#7682e8]" />
            <p className="text-gray-500">Loading...</p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
