import Link from "next/link";
import { AISearch } from "./ai-search";
import { ThemeSwitch } from "./theme-switch";
import { auth, signOut } from "@/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Image } from "@imagekit/next";
import { Button } from "@/components/ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Bookmarks } from "./bookmarks";

export const Header = () => {
  return (
    <header className="p-5 w-full flex justify-between  items-center">
      <Link href="/" className="">
        CAR's
      </Link>

      <div className="flex gap-2">
        <AISearch />

        <ThemeSwitch />

        <HeaderAuth />
      </div>
    </header>
  );
};

const HeaderAuth = async () => {
  const session = await auth();
  const user = session?.user;

  const logout = async () => {
    "use server";
    await signOut();
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={user.image!}
                alt={user?.name || "User Avatar"}
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-full p-3 flex flex-col gap-2">
            <p className=" font-bold">My Profile</p>

            <Separator />

            <Bookmarks />

            <form action={logout}>
              <button
                className="flex w-full  hover:bg-muted items-center justify-center gap-1 p-1 px-2 cursor-pointer rounded-md"
                type="submit"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </form>
          </PopoverContent>
        </Popover>
      ) : (
        <Link href="/api/auth/signin" className="">
          <Button className="cursor-pointer">
            <LogInIcon className="h-4 w-4" />
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};
