import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@imagekit/next";
import { BookmarkIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const Bookmarks = async () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <p className="flex items-center justify-center  hover:bg-muted cursor-pointer rounded-md  gap-1 p-1">
          <BookmarkIcon className="h-4 w-4" /> Saved
        </p>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1">
            Bookmarks <BookmarkIcon className="h-4 w-4" />
          </SheetTitle>
        </SheetHeader>

        <Suspense fallback={<Skeleton className=" h-[calc(100vh-64px)]" />}>
          <ScrollArea className="h-[calc(100vh-64px)] p-4 ">
            <div className="flex flex-col gap-4 ">
              <MainContent />
            </div>
          </ScrollArea>
        </Suspense>
      </SheetContent>
    </Sheet>
  );
};

const MainContent = () => {
  const cars = sampleCars;

  return cars.map((car) => (
    <Card key={car.id} className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className="object-cover"
        />

        {/* <RemoveBookmark carId={car.id} /> */}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold">{car.name}</h3>

            <p className="text-sm text-gray-500">
              {car.year} • {car.mileage} miles
            </p>
          </div>

          <p className="text-xl font-bold text-primary">
            ${car.price.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2 mt-4 w-1/2">
          <Button className="w-full" asChild>
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/contact/${car.id}`}>Contact Seller</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  ));
};

const sampleCars = [
  {
    id: "1",
    name: "BMW X4",
    brand: "BMW",
    type: "SEDAN",
    year: "2012",
    mileage: 30000,
    colors: ["red", "green"],
    price: 30000.0,
    description: "A luxury SUV with a sporty design and advanced features.",
    images: ["/carcover.jpg"],
    userId: "asd123",
    isSold: false,
    isFeatured: false,
    isNew: false,
    features: ["Towing package", "Navigation system"],
    location: "London, UK",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
