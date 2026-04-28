'use client';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="
        w-[90%] max-w-sm p-5 rounded-xl shadow-lg
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
      ">

        {/* TITLE */}
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg
              bg-gray-200 hover:bg-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-800 dark:text-gray-200
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-500 hover:bg-red-600
              text-white
              transition
            "
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
}