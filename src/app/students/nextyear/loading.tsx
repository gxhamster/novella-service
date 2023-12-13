import LoadingIcon from "@/components/icons/LoadingIcon";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <LoadingIcon size={100} className="text-primary-500" />
    </div>
  );
}
