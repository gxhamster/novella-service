import AlertIcon from "@/components/icons/AlertIcon";

type BookDeleteCardProps = {
  onClick: () => void;
};

export default function BookDeleteCard({ onClick }: BookDeleteCardProps) {
  return (
    <div className="border-[1px] border-alert-300 bg-alert-100   flex p-4 gap-5">
      <AlertIcon size={20} className="text-alert-600" />
      <div className="flex flex-col gap-2">
        <span className="text-surface-800 text-sm">
          Deleting this book remove it from the database
        </span>
        <span className="text-alert-600 text-xs">
          Please note that the book cannot be recovered if deleted
        </span>
        <button
          onClick={onClick}
          className="mt-4 bg-alert-100 border-alert-300 border-[1px] px-4 py-2 text-xs w-32 hover:bg-alert-600 hover:text-alert-950 text-alert-600 transition-colors focus:ring-[1px] focus:ring-alert-900"
        >
          Delete book
        </button>
      </div>
    </div>
  );
}
