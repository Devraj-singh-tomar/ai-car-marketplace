"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SearchIcon } from "lucide-react";
import React, { FormEvent, useState } from "react";

export const AISearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger className="cursor-pointer p-2 flex items-center gap-2 bg-muted rounded-lg hover:bg-muted text-sm">
        <SearchIcon className="h-4 w-4" /> Search with AI
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Define what type of car you like </DialogTitle>

          <DialogDescription>
            You can tell features like color, type, and model. For example: I
            like a red SUV with a sunroof.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <Textarea
            placeholder="Write about your dream car..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="max-h-[10rem]"
            style={{
              // @ts-expect-error: css not updated
              fieldSizing: "content",
            }}
          />

          <Button
            disabled={isLoading}
            className="flex items-center gap-1 cursor-pointer"
          >
            {isLoading ? "Searching..." : <>Find my dream car</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
