import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { FileTextIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateFile } from "@/features/files/api/use-create-file";
import { createFileSchema } from "@/features/files/schema";
import { useToast } from "@/hooks/use-toast"


interface CreateTaskFormProps {
  onCancel?: () => void;
  onSuccess?: (document: {
    id: string;
    name: string;
    file: File;
    createdAt: Date;
    status: string;
  }) => void;
}

export const CreateTaskForm = ({ onCancel, onSuccess }: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof createFileSchema>>({
    resolver: zodResolver(createFileSchema.omit({workspaceId:true})), });

  const onSubmit = async (values: z.infer<typeof createFileSchema>) => {
    // First, create the document object for the DataTable
    const file = values.image instanceof File ? values.image : null;
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    const newDocument = {
      id: Math.random().toString(36).substring(7),
      name: file.name,
      file: file,
      createdAt: new Date(),
      status: "Processing",
    };

    // Notify the parent component about the new document
    onSuccess?.(newDocument);

    // Then proceed with the database upload
    const finalValues = {
      ...values,
      workspaceId,
      image: file,
      name:file.name,
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          setFileName(null);
          
          // Show success message
          toast({
            title: "Success",
            description: "Document uploaded successfully",
          });

          // Navigate to the project page
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
          
          // Close the modal if needed
          onCancel?.();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "🥴Failed to upload document",
            variant: "destructive",
          });
          
          // Update the document status in the DataTable to show the failure
          onSuccess?.({
            ...newDocument,
            status: "Failed",
          });
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setFileName(file.name);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Upload document</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      <Avatar className="w-[72px] h-[72px] bg-neutral-200 rounded-full flex items-center justify-center">
                        <FileTextIcon className="w-[36px] h-[36px] text-neutral-400" />
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-xs font-bold text-black">
                          <span className="text-xs font-normal text-muted-foreground">
                            Supported File Formats:
                          </span>{" "}
                          JPG, PNG, JPEG, or PDF, max 10MB
                        </p>
                        <input
                          className="hidden"
                          type="file"
                          ref={inputRef}
                          onChange={handleImageChange}
                          accept=".jpg,.jpeg,.png,.pdf"
                          disabled={isPending}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="destructive"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange(null);
                              setFileName(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            Replace
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="teritary"
                            size="xs"
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />

              <DottedSeparator className="py-7" />

              {fileName && (
                <div className="text-sm font-bold text-violet-700 mt-4">
                  {`👋${fileName}`}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={!onCancel ? "invisible" : ""}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isPending || !fileName}
                >
                  save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};