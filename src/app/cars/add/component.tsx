"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "@/lib/actions/cars-action";
import { imageKitAuthenticator } from "@/lib/imageKit";
import { generateImageSchema, GenerateImageSchema } from "@/lib/zod";
import { useImages } from "@/store/image-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import NextImage from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export const GenerateImage = () => {
  const { addImage } = useImages();

  const [image, setImage] = useState<{ base64Data: string; name: string }>();
  const [uploadLoader, setUploadLoader] = useState(false);
  const [generatingLoader, setGeneratingLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  const abortController = new AbortController();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GenerateImageSchema>({
    defaultValues: {
      description: "",
      name: "",
    },
    resolver: zodResolver(generateImageSchema),
  });

  const onSubmit = async ({ description, name }: GenerateImageSchema) => {
    const toastId = toast.loading("Generating image...");

    try {
      setGeneratingLoader(true);

      if (!description || !name)
        throw new Error("Description and name are required");

      // Generating Image
      const data = await generateImage(description, name);

      if (!data) throw new Error("Failed to generate image");

      setImage(data);

      toast.success("Image generated successfully", { id: toastId });
    } catch (error) {
      toast.error("Error generating image", { id: toastId });
    } finally {
      setGeneratingLoader(false);
    }
  };

  const handleUpload = async () => {
    if (!image) return toast.error("No image to upload");

    let authParams;

    setUploadLoader(true);

    try {
      authParams = await imageKitAuthenticator();
    } catch (error) {
      console.log("Error authenticating with ImageKit", error);
      setUploadLoader(false);
      return;
    }

    const { expire, publicKey, signature, token } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: image.base64Data,
        fileName: image.name,
        folder: "cars",
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      console.log("upload response", uploadResponse);

      if (!uploadResponse.filePath)
        return toast.error("Failed to upload image");

      addImage(uploadResponse.filePath);

      toast.success("Image uploaded successfully");
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    } finally {
      setUploadLoader(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Generate Image</h1>

      <p className="text-muted-foreground">
        Use AI to generate an image of your dream car.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-4"
      >
        <div className="space-y-2 ">
          <Label htmlFor="description">Description</Label>

          <Textarea
            id="description"
            placeholder="Describe the car you want to generate..."
            rows={6}
            required
            {...register("description")}
          />

          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2 ">
          <Label htmlFor="file-name">File Name</Label>

          <Input
            id="file-name"
            placeholder="Enter a name for the generated image..."
            required
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <Button disabled={generatingLoader}>
          {generatingLoader ? "Generating..." : "Generate Image"}
        </Button>
      </form>

      {image && (
        <>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Generated Image</h2>

            {generatingLoader ? (
              <Skeleton className="w-full h-96 rounded-lg flex items-center justify-center" />
            ) : (
              <NextImage
                width={1000}
                height={1000}
                src={image.base64Data}
                alt="Generated Car"
                className="w-full h-[25rem] object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              onClick={() =>
                setImage({
                  base64Data: "",
                  name: "",
                })
              }
              className="cursor-pointer "
              variant="outline"
            >
              Cancel
            </Button>

            <Button
              disabled={uploadLoader}
              onClick={handleUpload}
              className="cursor-pointer "
            >
              {uploadLoader ? "Uploading" : "Upload image"}
            </Button>
          </div>
        </>
      )}

      {progress > 0 && (
        <div className="mt-4 w-full">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
};
