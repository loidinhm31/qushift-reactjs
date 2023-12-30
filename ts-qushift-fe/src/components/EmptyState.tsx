import { useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

type EmptyStateProps = {
  text: string;
  icon: IconType;
};

export const EmptyState = (props: EmptyStateProps) => {
  const router = useRouter();

  return (
    <div>
      <div>
        <props.icon size="30" color="DarkOrange" />
        <p>{props.text}</p>
        <a onClick={() => router.back()} color="blue.500">
          <p>Click here to go back</p>
        </a>
      </div>
    </div>
  );
};
