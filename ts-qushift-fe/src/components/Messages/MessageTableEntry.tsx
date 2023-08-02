import { Chip } from "konsta/react";

import { useUser } from "@/hooks/useUser";
import { Message } from "@/types/Conversation";

interface MessageTableEntryProps {
  item: Message;
}

export function MessageTableEntry(props: MessageTableEntryProps) {
  const { item } = props;

  const { defaultUser: user } = useUser();

  const getDateTime = (dateTime) => {
    const now = new Date(dateTime);
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const dayToDisplay = date < 10 ? `0${date}` : `${date}`;
    const monthToDisplay = month < 10 ? `0${month}` : `${month}`;
    const hoursToDisplay = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesToDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${year}/${monthToDisplay}/${dayToDisplay} ${hoursToDisplay}:${minutesToDisplay}`;
  };

  return (
    <>
      {item.sender === user?.id && (
        <div className="space-y-4 flex flex-col items-end">
          <div className="flex justify-center items-center w-full">
            <div className="m-1 text-xs">{getDateTime(item.createdAt)}</div>
          </div>
          <div className="flex w-fit-content">
            <div className="flex flex-row">
              <div className="flex p-1">
                <div>
                  <div className="flex justify-end">
                    <div className="text-sm">{item.sender}</div>
                  </div>
                  <div className="dark:bg-gray-800 gap-2w fit-content max-w-full p-4 rounded-md whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>

                <div className="flex items-end">
                  <Chip className="m-1">{`${item.sender.at(0)?.toUpperCase()}`}</Chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {item.sender !== user?.id && (
        <div className="space-y-4 flex flex-col items-end">
          <div className="flex justify-center items-center w-full">
            <div className="m-1 text-xs">{getDateTime(item.createdAt)}</div>
          </div>
          <div className="flex w-fit-content">
            <div className="flex flex-row">
              <div className="flex p-1">
                <div className="flex items-end">
                  <Chip className="m-1">{`${item.sender.at(0)?.toUpperCase()}`}</Chip>
                </div>
                <div>
                  <div className="flex justify-start">
                    <div className="text-sm">{item.sender}</div>
                  </div>
                  <div className="dark:bg-sky-600 gap-2 w-fit-content max-w-full p-4 rounded-md whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
