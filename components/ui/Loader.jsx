export default function Loader({ text = "Loading..." }) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-emerald-600 rounded-full" />
        <p className="mt-3 text-gray-500 text-sm">{text}</p>
      </div>
    );
  }