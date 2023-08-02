"use client";

import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { TopicMenu } from "@/components/Topic/TopicMenu";
import { useUser } from "@/hooks/useUser";
import { getTopicsApi } from "@/service/messages";

export default function Message() {
  const { status, defaultUser: user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !user.id) {
      redirect("/signin");
    }

    if (user.id) {
      getTopicsApi(user)
        .then((res) => res.data)
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            const members = data[i].members;
            for (let j = 0; j < members!.length; j++) {
              if (members![j].userId === user.id && members![j].checkSeen) {
                router.replace(`/messages/${data[i].id}`);
                return;
              }
            }
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [status, user]);

  return (
    <div className="flex items-start">
      <div className="shadow-xl rounded-xl">{!isLoading && <TopicMenu sendSignal={false} />}</div>
    </div>
  );
}
