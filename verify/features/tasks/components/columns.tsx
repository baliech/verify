import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, ExternalLinkIcon, LoaderIcon, CheckCircleIcon, LucideView, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Files } from "@/features/files/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Axios from "axios";
import { Client, Databases, Query } from "node-appwrite";
import { Avatar } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface KanbanItem {
  question: string;
  answer: string;
  status: "Found" | "Not Found";
}

interface ModalData {
  invoice: string;
  name: string;
  total: string;
  invoiceNumber: string;
  referenceNumber: string;
  TCM: string;
}

interface ColumnsProps {
  handleAddToKanban: (url: string, results: KanbanItem[]) => void;
  submittedFiles?: Set<string>;
  onDelete: (ids: string[]) => Promise<void>;
}

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("670a643c001fe74b48b8");
const databases = new Databases(client);

export const columns = ({ handleAddToKanban, submittedFiles=new Set(), onDelete }: ColumnsProps): ColumnDef<Files>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Analyze",
    cell: ({ row }) => {
      const url = row.getValue("imageUrl") as string | undefined;
      const [isLoading, setIsLoading] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalData, setModalData] = useState<ModalData | null>(null);
      const [isApproved, setIsApproved] = useState(false);
      const { toast } = useToast();

      const isSubmitted = url ? submittedFiles?.has(url) ?? false : false;

      const handleUpload = async () => {
        if (!url) {
          toast({
            title: "🥴 Notification",
            description: "Duplicate file",
            variant: "destructive",
          });
          return;
        }

        const fileId = url.split("/files/")[1]?.split("/")[0] || "file";

        try {
          const response = await databases.listDocuments(
            "670d8bc8002f74b172a8",
            "6746ff3a00397d5d9924",
            [Query.equal("hash", fileId)]
          );

          if (response.total > 0) {
            const matchedDocument = response.documents[0];
            setModalData({
              invoice: matchedDocument.invoice,
              name: matchedDocument.name,
              total: matchedDocument.total,
              invoiceNumber: matchedDocument["invoice-number"],
              referenceNumber: matchedDocument["reference-number"],
              TCM: matchedDocument.TCM,
            });
            setIsApproved(!!matchedDocument.total);
            setIsModalOpen(true);
            return;
          }

          setIsLoading(true);
          const fileResponse = await Axios.get(url, { responseType: "blob" });
          const file = new Blob([fileResponse.data], {
            type: fileResponse.headers["content-type"],
          });

          const fileExtension = fileResponse.headers["content-type"]?.split("/")[1] || "png";
          const fileName = `${fileId}.${fileExtension}`;

          const formData = new FormData();
          formData.append("file", file, fileName);
          formData.append("imageUrl", url);

          const apiResponse = await Axios.post("http://127.0.0.1:8000/uploadfile/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          toast({
            title: "😎 Success",
            description: "File uploaded and analyzed successfully!",
          });

          if (apiResponse.data.responses) {
            handleAddToKanban(url, apiResponse.data.responses);
          }
        } catch (error) {
          console.error("Upload error:", error);
          if (Axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.detail || "successfully submitted for review";
            toast({
              title: "✔Congratulations",
              description: errorMessage,
            });
          } else {
            toast({
              title: "Error",
              description: "An unexpected error occurred.",
              variant: "destructive",
            });
          }
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <LucideView className="w-5 h-5 text-purple-500 hover:text-purple-700 cursor-pointer" />
          </a>
          {isSubmitted ? (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isApproved ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <Button
                size="sm"
                variant="outline"
                className="cursor-not-allowed opacity-50"
                disabled={true}
              >
                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                Submitted
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleUpload} disabled={isLoading}>
              {isLoading ? (
                <LoaderIcon className="animate-spin w-4 h-4 text-violet" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
          {isModalOpen && modalData && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">👋Results</h2>
                  <Badge 
                    className={
                      modalData.total 
                        ? "bg-green-500 text-white" 
                        : "bg-yellow-500 text-white"
                    }
                  >
                    {modalData.total ? "Approved" : "Unapproved"}
                  </Badge>
                </div>
                <DottedSeparator className="mb-4"/>
                <ul className="space-y-2">
                  <li>
                    <strong>Invoice:</strong> {modalData.invoice}
                  </li>
                  <li>
                    <strong>Name:</strong> {modalData.name}
                  </li>
                  <li>
                    <strong>Total:</strong> {modalData.total}
                  </li>
                  <li>
                    <strong>Invoice Number:</strong> {modalData.invoiceNumber}
                  </li>
                  <li>
                    <strong>Reference Number:</strong> {modalData.referenceNumber}
                  </li>
                  <li>
                    <strong>TCM:</strong> {modalData.TCM}
                  </li>
                  <DottedSeparator className="mt-6"/>
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Document Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar className="w-[36px] h-[36px] bg-neutral-200 rounded-full flex items-center justify-center">
          <FileTextIcon className="w-4 h-4 text-muted-foreground" />
        </Avatar>
        <span>{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "timeAdded",
    header: "Added",
    cell: ({ row }) => (
      <span>{formatDistanceToNow(new Date(row.getValue("timeAdded")))} ago</span>
    ),
  },
];