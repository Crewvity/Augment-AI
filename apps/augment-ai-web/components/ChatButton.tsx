import { LoadingIcon } from "@/components/LoadingIcon";

export enum ButtonType {
  PRIMARY,
  CRITICAL,
}

export function ChatButton({
  isLoading,
  onClick,
  children,
  type,
}: {
  isLoading: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  type: ButtonType;
}) {
  const bgColor = type === ButtonType.PRIMARY ? "bg-sky-600" : "bg-red-500";
  const color = type === ButtonType.PRIMARY ? "fill-sky-800" : "fill-red-700";
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-8 py-4 rounded w-28 ${bgColor}`}
    >
      <div
        role="status"
        className={`${isLoading ? "" : "hidden"} flex justify-center`}
      >
        <LoadingIcon color={color} />
        <span className="sr-only">Loading...</span>
      </div>
      <span className={isLoading ? "hidden" : ""}>{children}</span>
    </button>
  );
}
